// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

/**
 * 通过mesh修改顶点数据
 */
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Vec2)
    offset: cc.Vec2 = new cc.Vec2(0, 0);

    @property(cc.SpriteFrame)
    spriteFrame: cc.SpriteFrame = null;

    @property({ type: cc.Integer, displayName: "网格行数" })
    row: number = 10;

    @property({ type: cc.Integer, displayName: "网格列数" })
    col: number = 20;

    @property({ type: cc.Float, displayName: "速度" })
    speed: number = 10;

    @property({ type: cc.Float, displayName: "幅度" })
    amplitude: number = 5;

    @property({ type: cc.Integer, displayName: "波浪" })
    wave: number = 5;

    // LIFE-CYCLE CALLBACKS:

    private _meshCache;
    private _vertexes;
    private _renderer;
    onLoad() {
        this._meshCache = {};
        this._vertexes = [];

        // 添加 MeshRenderer
        let renderer = this.node.getComponent(cc.MeshRenderer);
        if (!renderer) {
            renderer = this.node.addComponent(cc.MeshRenderer);
        }
        renderer.mesh = null;
        this._renderer = renderer;

        this.updateMesh();
        this.applySpriteFrame();
        this.applyVertexes();

        // 加载对应材质 要加载的对象请放在resources目录下（引擎要求）
        cc.loader.loadRes('customShader', cc.Material, (err, mat) => {
            if (err) {
                cc.error(err.message || err);
                return;
            }

            this._renderer.setMaterial(0, mat);
            this.updateMaterial();
        });

    }

    private _gfx = cc.gfx; // **无视**
    private _mesh;
    updateMesh() {

        // 确定顶点坐标
        this._vertexes = [];
        const _width = this.node.width;
        const _height = this.node.height;
        for (let _row = 0; _row < this.row + 1; _row++) {
            for (let _col = 0; _col < this.col + 1; _col++) {
                const x = (_col - this.col * this.node.anchorX) * _width / this.col;
                const y = (_row - this.row * this.node.anchorY) * _height / this.row;
                this._vertexes.push(cc.v2(x, y));
            }
        };

        let gfx = this._gfx;
        // 绑定模型
        let mesh = this._meshCache[this._vertexes.length];
        if (!mesh) {
            mesh = new cc.Mesh();
            mesh.init(new gfx.VertexFormat([
                { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
                { name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
            ]), this._vertexes.length, true);
            this._meshCache[this._vertexes.length] = mesh;
        }
        this._mesh = mesh;
    }

    applySpriteFrame() {
        if (this.spriteFrame) {
            let texture = this.spriteFrame.getTexture();
            this._texture = texture;
        }
    }

    private _texture;
    applyVertexes() {
        let gfx = this._gfx;
        // 设置坐标
        const mesh = this._mesh;
        mesh.setVertices(gfx.ATTR_POSITION, this._vertexes);

        if (this._texture) {
            let uvs = [];
            // 计算uv
            for (const pt of this._vertexes) {
                const u = (pt.x + this._texture.width * this.node.anchorX + this.offset.x) / this._texture.width;
                const v = 1.0 - (pt.y + this._texture.height * this.node.anchorY + this.offset.y) / this._texture.height;
                uvs.push(cc.v2(u, v));
            }
            mesh.setVertices(gfx.ATTR_UV0, uvs);
        }

        if (this._vertexes.length >= 3) {
            // 计算顶点索引 
            let ids = [];
            let getIndexByRowCol = (_row, _col) => {
                return _row * (this.col + 1) + _col;
            }
            for (let _row = 0; _row < this.row; _row++) {
                for (let _col = 0; _col < this.col; _col++) {
                    ids.push(getIndexByRowCol(_row, _col), getIndexByRowCol(_row, _col + 1), getIndexByRowCol(_row + 1, _col));
                    ids.push(getIndexByRowCol(_row + 1, _col), getIndexByRowCol(_row + 1, _col + 1), getIndexByRowCol(_row, _col + 1));
                }
            };
            mesh.setIndices(ids);

            if (this._renderer.mesh != mesh) {
                // mesh 完成后再赋值给 MeshRenderer , 否则模拟器(mac)会跳出
                this._renderer.mesh = mesh;
            }
        } else {

        }
    }

    updateMaterial() {
        // Reset material
        let material = this._renderer._materials[0];
        if (material) {
            if (this._texture) {
                // 设置 texture 
                material.define("USE_TEXTURE", true);
                material.setProperty('texture', this._texture);
            }

            // 设置着色器 uniform 参数
            material.setProperty('textureWidth', this.node.width);
            material.setProperty('speed', this.speed);
            material.setProperty('amplitude', this.amplitude);
            material.setProperty('wave', this.wave);
            if (this._vertexes.length > 0)
                material.setProperty('startPos', this._vertexes[0]); // ???
        }
    }

}
