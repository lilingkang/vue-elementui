import {nanoid} from 'nanoid'
// eslint-disable-next-line no-unused-vars
class Simulator {
  /**
   * @description 输入订单，为产品对象的数组，每个产品对象包括产品类型 id、数量、加工位置序列
   * 位置定义：'0' -- 物料区
   *          '1' -- 加工区/车削
   *          '2'-- 加工区/铣削
   *          '3' -- 加工区/钻孔
   *          '4' -- 加工区/磨削
   *          '5' -- 码放区
   * 加工位置序列格式：
   *          e.g. 工艺流程：车 -> 铣 -> 磨
   *               加工位置序列：‘124’
   * 订单格式 order: [
   *          {
   *            productTypeId: '',
   *            num: '',
   *            posList: '',
   *            process: [{productObjectId: '', value: 0},
   *            {productObjectId: '', value: 0}, ...] // 当前产品加工完成进度 e.g. 工序0完成 填1
   *          }, ...]
   * 任务池格式 taskPool: [
   *          {
   *            productTypeId: '',
   *            productObjectId: '',  // 产品实例化对象 id
   *            transOrder: '' // 任务移动要求：e.g. 0 -> 1  transOrder: '01'
   *          }, ...]
   * @param order
   */
  constructor (order, state) {
    this.productType = state.product.productType
    this.craft = state.craft.craftType

    this.taskPool = [] // 任务池（当前时刻全部等待完成的任务）
    this.taskSeq = [] // 任务序列（按时间顺序排列已经完成的任务）
    this.order = []
    this.transTimeMatrix = // 带权邻接矩阵，t_ij 刻画 amr 从 i 移动到 j 的时间
      [[0, 20, 30, 20, 30, 60],
        [20, 0, 10, 10, 15, 60],
        [30, 10, 0, 15, 10, 60],
        [20, 10, 15, 0, 10, 60],
        [30, 15, 10, 10, 0, 60],
        [60, 60, 60, 60, 60, 0]]
    this.time = 0 // amr小车完成搬运任务所需时间
    // 机床状态，remainTime表示剩余加工时间，小于0表示机床闲置时间
    this.facility = [
      {
        product: [],
        remainTime: 0
      },
      {
        product: [],
        remainTime: 0
      },
      {
        product: [],
        remainTime: 0
      },
      {
        product: [],
        remainTime: 0
      }
    ]

    this.currentPos = '0' // amr小车当前位置
    // this.amrState = 0 // 0：amr小车空闲/上一任务已完成（等待分配任务），1：执行任务中

    // 按格式初始化订单
    this.initOrder(order.productsList)

    // 按格式初始化任务池
    this.initTaskPool()
  }
  initOrder (productsList) {
    for (let i = 0; i < productsList.length - 1; i++) {
      // 加工位置序列格式
      let posList = ''
      // 按类型索引产品属性
      let product = this.productType.find(el => el.typeId === productsList[i].productTypeId)
      for (let j = 0; j < product.craftProcess.length; j++) {
        // 按工艺id获得工艺索引（位置索引）
        let index = this.craft.findIndex(el => el.craftId === product.craftProcess[j].craftId) + 1
        posList += String(index)
      }
      this.order.push({
        productTypeId: productsList[i].productTypeId,
        num: productsList[i].productNum,
        posList: posList,
        process: []
      })
    }
  }
  initTaskPool () {
    for (let i = 0; i < this.order.length; i++) {
      for (let j = 0; j < this.order[i].num; j++) {
        let id = 'p-' + nanoid()
        this.taskPool.push({
          productTypeId: this.order[i].productTypeId,
          productObjectId: id,
          transOrder: 0 + this.order[i].posList[0]
        })
        // 补充订单中产品 id 信息
        this.order[i].process.push({
          productObjectId: id,
          value: 0
        })
      }
    }
    // console.log({...this.taskPool})
    // console.log({...this.order})
  }
  randomExtractTask () { // 随机从任务池抽取任务
    let index = Math.floor(Math.random() * this.taskPool.length)
    let task = this.taskPool.splice(index, 1)[0]
    let dt = 0

    // console.log('task:')
    // console.log(task)
    dt += this.transTimeMatrix[this.currentPos][task.transOrder[0]]
    task.startTime = this.time + dt
    dt += this.transTimeMatrix[task.transOrder[0]][task.transOrder[1]]

    this.time += dt
    this.facility[0].remainTime -= dt
    this.facility[1].remainTime -= dt
    this.facility[2].remainTime -= dt
    this.facility[3].remainTime -= dt

    if ('1234'.indexOf(task.transOrder[0]) !== -1) { // 任务起点位于加工区，清除相应设备加工工件
      let ind = this.facility[task.transOrder[0] - 1].product.findIndex(el => el.objectId === task.productObjectId)
      this.facility[task.transOrder[0] - 1].product.splice(ind, 1)
    }
    if ('1234'.indexOf(task.transOrder[1]) !== -1) { // 任务终点位于加工区，为相应设备设置加工时间
      this.facility[task.transOrder[1] - 1].product.unshift({
        typeId: task.productTypeId,
        objectId: task.productObjectId
      })
      if (this.facility[task.transOrder[1] - 1].remainTime >= 0) {
        this.facility[task.transOrder[1] - 1].remainTime += this.craft[task.transOrder[1] - 1].time
      } else {
        this.facility[task.transOrder[1] - 1].remainTime = this.craft[task.transOrder[1] - 1].time
      }
      // console.log(this.craft[task.transOrder[1] - 1].time)
      // console.log(this.facility[task.transOrder[1] - 1].remainTime)
      // console.log(this.facility)
    }

    this.currentPos = task.transOrder[1]
    this.taskSeq.push(task)
  }
  updateTaskPool () { // 更新任务池，判断是否有产品工序加工完成
    for (let i = 0; i < 4; i++) {
      let process = Math.max(0, Math.ceil(this.facility[i].remainTime / this.craft[i].time)) // 当前机床还有几个产品在加工
      if (this.facility[i].product.length &&
        process < this.facility[i].product.length) {
        for (let j = process; j < this.facility[i].product.length; j++) {
          // console.log(process)
          if (this.taskPool.findIndex(el => el.productObjectId === this.facility[i].product[j].objectId) !== -1) {
            continue
          }

          // console.log({...this.facility})
          let order = this.order.find(el => el.productTypeId === this.facility[i].product[j].typeId)
          // console.log('value:')
          // console.log({...order})
          // console.log(this.facility[i].product[j].objectId)
          let value = ++order.process.find(el => el.productObjectId === this.facility[i].product[j].objectId).value
          // eslint-disable-next-line no-unused-vars
          let transOrder
          if (value === order.posList.length) { // 说明该产品工艺流程已经走完，应送到码放区
            transOrder = order.posList[value - 1] + '5'
          } else if (value < order.posList.length) {
            transOrder = order.posList[value - 1] + order.posList[value]
          } else {
            continue
          }
          // console.log(typeof (order.posList))
          // console.log(transOrder)
          this.taskPool.push({
            productTypeId: this.facility[i].product[j].typeId,
            productObjectId: this.facility[i].product[j].objectId,
            transOrder: transOrder
          })
        }
      }
    }
  }
  wait () {
    let dt
    // 预测哪个工位将要有物料加工完成
    // eslint-disable-next-line no-unused-vars
    let pos = ''
    let target = 1
    for (let i = 0; i < 4; i++) {
      if (this.facility[i].remainTime >= 0) {
        let temp = this.facility[i].remainTime / this.craft[i].time - Math.floor(this.facility[i].remainTime / this.craft[i].time) // 当前机床还有几个产品在加工
        if (temp < target) {
          target = temp
          pos = String(i + 1)
        }
      }
    }
    if (this.currentPos !== pos) {
      this.taskSeq.push({
        productTypeId: '',
        productObjectId: '',
        startTime: this.time,
        transOrder: this.currentPos + pos
      })
      dt = this.transTimeMatrix[this.currentPos][pos]
      this.time += dt
      this.facility[0].remainTime -= dt
      this.facility[1].remainTime -= dt
      this.facility[2].remainTime -= dt
      this.facility[3].remainTime -= dt
      this.currentPos = pos
    } else {
      dt = 1
      this.time += dt
      this.facility[0].remainTime -= dt
      this.facility[1].remainTime -= dt
      this.facility[2].remainTime -= dt
      this.facility[3].remainTime -= dt
    }
  }
  simulate () {
    // 循环从任务池中抽取任务，并更新任务池
    while (this.taskPool.length || this.facility[0].product.length || this.facility[1].product.length ||
    this.facility[2].product.length || this.facility[3].product.length) {
      if (this.taskPool.length) {
        this.randomExtractTask()
      } else {
        this.wait()
      }
      this.updateTaskPool()
      if (this.time > 1e5) {
        break
      }
    }
    return [this.time, this.taskSeq, this.order, this.transTimeMatrix]
  }
}

export default Simulator
