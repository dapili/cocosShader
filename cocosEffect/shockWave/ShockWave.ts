// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShockWave extends cc.Component {

    @property(cc.Node)
    bg: cc.Node = null;
    material: cc.Material = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.material = this.bg.getComponent(cc.Sprite).getMaterial(0);
        this.bg.on(cc.Node.EventType.TOUCH_END, this.touchStartEvent, this);
    }

    touchStartEvent(evt: cc.Event.EventTouch) {
        let pos = evt.getLocation();
        pos = this.node.convertToNodeSpaceAR(pos);
        pos.x += this.node.width / 2;
        pos.y += this.node.height / 2;

        this.material.setProperty('center', [pos.x / this.bg.width, (this.bg.height - pos.y) / this.bg.height]);
        this._time = 0;
    }
    
    private _time:number = 0.0;
    update(dt) {
        this._time += dt;
        if (this._time > 1) return;
        this.material.setProperty('u_time', this._time);

    }

}
