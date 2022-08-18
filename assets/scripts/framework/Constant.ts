import {_decorator, Component, Node} from 'cc';

const {ccclass, property} = _decorator;

export class Constant {

    //飞机类型
    public static EnemyType = {
        TYPE1: 1,
        TYPE2: 2
    }

    //敌机组合类型
    public static Combination = {
        PLANE1: 1,
        PLANE2: 2,
        PLANE3: 3
    }
}

