import { Commit } from 'vuex';
import { gameOneLog, gameOneLogExcel } from '../../../api/admin/logManage/log';

export interface State {
    jdnnGameLogData: JdnnGameLogData[],
    code: number
    totalCount: number
    gameId: string
    JdnnStageLog: object,
    next: boolean
}
export interface JdnnGameLogData {
    bets: string
    endDate: string
    gameData: object
    gameId: number
    gid: string
    logDate: string
    rType: number
    rid: number
    yid: string
    startDate: string
    users: any[]
    _id: string
}
type Msg = {
    data: JdnnGameLogData[]
    totalCount: number,
    next: boolean
}
type GetJdnnGameLog = {
    code: number
    msg: Msg
}//获取结果LoginLog

// initial state
const state: State = {
    jdnnGameLogData: [],
    code: 0,
    totalCount: 0,
    gameId: "",
    JdnnStageLog: [],
    next: false
}

const mutations = {
    SET_JDNNGAMELOG: (state: State, data: GetJdnnGameLog) => {
        state.code = data.code,
            state.next = data.msg.next
        state.jdnnGameLogData = data.msg.data
    },
    //将当前的user字段的数据，保存到全局的store中
    SET_CUBJDNNUSERDETAIL: (state: State, data: any) => {
        state.gameId = data.gameId;
        state.JdnnStageLog = data.data;
    },
}
// actions
const actions = {
    GetJdnnGameLog(context: { commit: Commit, state: State }, queryItem) { //获取JdnnGameLog
        return new Promise(async (resolve, reject) => {
            gameOneLog(queryItem).then((response: { data }) => {
                context.commit('SET_JDNNGAMELOG', <GetJdnnGameLog>response.data)
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    },
    GetJdnnGameLogExcel(context: { commit: Commit, state: State }, queryItem) { //Excel
        return new Promise(async (resolve, reject) => {
            gameOneLogExcel(queryItem).then((response: { data }) => {
                resolve(response.data)
            }).catch(error => {
                console.error("catch", error)
                resolve()
            })
        });
    }
}
export default {
    state,
    // getters,
    actions,
    mutations
}
