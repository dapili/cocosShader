// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
/**
 * 图片选择mesh模式，修改图片vertices数据
 */
@ccclass
export default class NewClass extends cc.Component {

    private _sp: cc.Sprite = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._sp = this.node.getComponent(cc.Sprite);
        this.setVertics();
    }


    private _row: number = 3;
    private _col: number = 3;
    private setVertics() {
        // this.sp // cc.Sprite
        let vertices = this._sp.spriteFrame.vertices;

        let x = [];
        let y = [];
        let triangles = [];
        let triIndex = 0;
        for (let j = 0; j < this._row; j++) {
            for (let i = 0; i < this._col; i++) {
                let xStep = this._sp.node.width / this._col;
                x.push(i * xStep);
                x.push((i + 1) * xStep);
                x.push((i + 1) * xStep);
                x.push((i + 1) * xStep);
                x.push(i * xStep);
                x.push(i * xStep);

                let yStep = this._sp.node.height / this._row;
                y.push(j * yStep);
                y.push(j * yStep);
                y.push((j + 1) * yStep);
                y.push((j + 1) * yStep);
                y.push((j + 1) * yStep);
                y.push(j * yStep);

                triangles.push(triIndex + 0, triIndex + 1, triIndex + 2);
                triangles.push(triIndex + 3, triIndex + 4, triIndex + 5);
                triIndex += 6;
            }
        }

        let nu = [];
        let nv = [];
        for (let i = 0; i < x.length; i++) {
            nu.push(x[i] / this._sp.node.width);
            nv.push(y[i] / this._sp.node.height);
        }

        // this.sp // cc.Sprite
        this._sp.spriteFrame.vertices = {
            x,
            y,
            nu,
            nv,
            triangles,
        }
        // 标记顶点数据修改过了
        this._sp.setVertsDirty();
    }

}
