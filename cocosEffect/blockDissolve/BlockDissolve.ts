// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class BlockDissolve extends cc.Component {

    material: cc.Material = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.material = this.node.getComponent(cc.Sprite).getMaterial(0);
    }

    private _time:number = 0.0;
    update(dt) {
        this._time += dt;
        this.material.setProperty('u_time', this._time);
    }
}
