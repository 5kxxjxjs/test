import { getLonghuMatchStages, updateLonghuMatchStages } from '../../../api/admin/gameManager/gameManager'
import { CodeMsg } from '../../index'
import { Commit, Dispatch } from 'vuex'
import store from '../../../store'
export interface State {
    matchStagesData: matchStagesData[],
    code: number,
    minRobotRoomCountEditFlag: boolean[],
    minRoomCountEditFlag: boolean[]
}
export interface robotWinRateType {
    value: string;
    rate: string;
}
export interface matchStagesData {
    id: string,
    active: boolean,
    idx: number,
    color: number,
    name: string,
    bets: string,
    minMoney: string,
    maxMoney: string,
    robotMinMoney: string,
    robotMaxMoney: string,
    maxRobotCount: number;
    minRobotRoomCount: number;
    minRoomCount: number;
    poolLine: string;
    poolValue: string;
    robotWinRate: robotWinRateType[];
    allowBetMinMoney : string,
    areaMaxMoney : string,
    areaTieMaxMoney : string,
}

// initial state
const state: State = {
    matchStagesData: [{
        active: false,
        bets: "0",
        color: 0,
        id: "0",
        idx: 0,
        maxMoney: "0",
        maxRobotCount: 0,
        minMoney: "0",
        minRobotRoomCount: 0,
        minRoomCount: 0,
        name: "",
        poolLine: "0",
        poolValue: "0",
        robotMaxMoney: "0",
        robotMinMoney: "0",
        robotWinRate: [],
        allowBetMinMoney : "50",
        areaMaxMoney : "20000",
        areaTieMaxMoney : "20000"
    }],
    minRobotRoomCountEditFlag: [],
    minRoomCountEditFlag: [],
    code: 0,
}


const mutations = {
    SET_LONGHUMATCHSTAGES: (state: State, data: matchStagesData[]) => {
        state.matchStagesData = data
        state.minRobotRoomCountEditFlag = []
        state.minRoomCountEditFlag = []
        data.forEach(() => {
            state.minRobotRoomCountEditFlag.push(false)
            state.minRoomCountEditFlag.push(false)
        })
    },
    UPDATE_LONGHUMATCHSTAGES: (state: State, code) => {
        state.code = code
    },
}
// actions
const actions = {
    GetLonghuMatchStages(context: { commit: Commit, state: State }) {
        return new Promise(async (resolve, reject) => {
            getLonghuMatchStages().then(response => {
                context.commit('SET_LONGHUMATCHSTAGES', response.data.msg)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },

    UpdateLonghuMatchStages(context: { commit: Commit, dispatch: Dispatch, state: State }, updateData) {
        return new Promise(async (resolve, reject) => {
            updateLonghuMatchStages(updateData).then(response => {
                context.commit('UPDATE_LONGHUMATCHSTAGES', response.data.code)
                resolve()
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    }

}
export default {
    state,
    actions,
    mutations
}
