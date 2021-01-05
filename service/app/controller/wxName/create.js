'use strict'

const Controller = require('egg').Controller
const { typeMap, wxRelation, season, wxLikeUseMap } = require('./const')
const { random } = require('../../utils/index')

/**
 * 与其给子万金，不如赐子好名
 */

class HomeController extends Controller {
  async createName() {
    const { ctx, app } = this

    // 模拟数据
    // ctx.request.body = {
    //   // 用户参数
    //   date: 1609724838855,
    //   feature: '',
    //   gender: '0',
    //   length: 2,
    //   surname: '陈',
    //   type: '0',
    //   word: '',
    //   // 时间参数
    //   dateInfo: {
    //     Animal: '鼠',
    //     AnimalsImg: 'Rat',
    //     IDayCn: '廿一',
    //     IMonthCn: '冬月',
    //     Term: null,
    //     astro: '魔羯座',
    //     cDay: 4,
    //     cMonth: 1,
    //     cYear: 2021,
    //     date: '2021-1-4',
    //     festival: null,
    //     gzDay: '壬子',
    //     gzHour: '乙巳',
    //     gzMonth: '戊子',
    //     gzYear: '庚子',
    //     hour: 9,
    //     isLeap: false,
    //     isTerm: false,
    //     isToday: true,
    //     lDay: 21,
    //     lMonth: 11,
    //     lYear: 2020,
    //     lunarDate: '2020-11-21',
    //     lunarFestival: null,
    //     nWeek: 1,
    //     ncWeek: '星期一',
    //     wxDay: '水水',
    //     wxHour: '木火',
    //     wxLack: [], // 缺少的五行
    //     wxLackStr: '',
    //     wxMap: { jin: 1, mu: 1, shui: 4, huo: 1, tu: 1 }, // 生辰八字的五行属性个数
    //     wxMap1: { 金: 'jin', 木: 'mu', 水: 'shui', 火: 'huo', 土: 'tu' },
    //     wxMap2: { jin: '金', mu: '木', shui: '水', huo: '火', tu: '土' },
    //     wxMonth: '土水',
    //     wxYear: '金水',
    //   },
    // }

    const { surname, gender = 0, length = 2, type = '0', dateInfo, pageSize = 20 } = ctx.request.body
    const { gzYear, gzMonth, gzHour, gzDay, wxYear, wxMonth, wxHour, wxDay, wxMap, wxMap1, wxMap2, wxLack, lDay } = dateInfo
    const wxMapStrong = {}
    for (let key in wxMap) {
      let num = wxMap[key]
      let strong = ''
      if (num === 0) {
        strong = '太弱'
      } else if (num === 1) {
        strong = '偏弱'
      } else if (num === 2) {
        strong = '偏旺'
      } else {
        strong = '太旺'
      }
      wxMapStrong[key] = {
        num,
        strong 
      }
    }

    /**
     * 木生火 火生土 土生金 金生水 水生木 木克土 火克金 土克水 金克木 水克火
     * 
     * 木扶木，木生火，木克土，木耗金，木泄水；火泄木，火扶火，火生土，火克金，
     * 火耗水；土耗木，土泄火，土扶土，土生金，土克水；金克木，金耗火，金泄土，
     * 金扶金，金生水；水泄木，水克火，水耗土，水泄金，水扶水。
     * 
     * 用神
  　　八字是五行bai（金、木、水、火、土）组成的。通常，五行在八字里都要等量平均，才会让人的一生吉利。假如某一行过旺或过弱，都会引发不吉利。如果某一行过旺怎么办呢?要利用另一行来抑制。如果某一行过弱怎么办呢?要利用另一行来帮扶。 这个用来抑制或帮扶的五行，就是用神。
  　　所谓用神, 就是八字中对于日干来说, 具有补弊救偏或促进助成作用的一种五行. 四柱命局以用神为核心, 用神健全有力与否, 影响人一生的命; 一生补救与否, 影响人一生的运.凡用神之力不足, 四柱中有生助用神者, 或四柱刑冲克害用神而能化凶神,制凶神者, 就是喜神. 四柱没有用神, 就得靠行运流年来补. 对于命局五行较为平衡, 用神不太紧缺的四柱, 其一生较为平顺, 无大起大落.
  　　比如，你日柱天干是甲木，生在冬天，木就太寒，这时候一般取火为用神，有火取暖，木才能有生机。再比如，你的日柱天干是丙火，生在夏天，火就太旺，这时候一般就取土为用神，以火生土，消化火的力量。
  　　喜神
  　　一般来说，喜神就是生用神的五行或克制忌神的五行，比如你的用神是土，火生土，火就可能是你的喜神。
  　　通常确定用神的方法是如下
  　　扶抑：旺则泄之，弱则助之，有扶有抑，到达中和。
  　　病药：用神选定，又被克害受伤时，伤用神者即是病，必要病得去除，才可反浊为清，有病有药是上等八字。
  　　调侯：五行中和，气侯不得适中，仍无生机不能奋发，特别是一些金寒水冷、火旺土燥之命，往往以浊而不清来看，得一调侯用神，使命局寒热适中，五行方可流通生化有情。
  　　（对于专旺，从弱的格局，太旺不可逆他，太弱不必帮他，顺势反而为美）
  　　庚 己 壬 戊
  　　寅 丑 戌 申
  　　公历：2011年1月7日16时24分 农历：庚寅年[松柏木]十二月初四日
  　　这个八字来看，日柱的天干是壬，日主自身的五行是水。以水为中心看，水生于己丑月，己丑土旺，日主的壬水受制，好在丑本身也有水的余气，水有弱根。这个八字的用神是金：年上天干的庚金与时上地支的申金，可以泄土生水（土生金，金生水）。这个八字的土旺，但是月上的旺土受年上的金，木的制约其他的日支，与时干的土也受时之的申金的制约，还是不错的。这个八字用金，喜水。
     
    一、排bai八字容易，从万年历上按日期找对所对应的干支即可，难的是分析日主强弱，定喜用神，冰冻三尺非一日之寒。
    1、排八字：乙亥(年柱) 丁亥(月柱) 壬申(日主) 丙午(时柱)
    2、分析表面旺弱：命中 1金、 1木、 3水、 2火、 五行缺土 ，日主是壬五行为属水 。
    3、分析实质旺弱：经详细计算后（步骤略）各五行旺弱如下：
    日主水偏旺，其余五行 金（太弱）、木（中和稍弱）、火（偏旺）、土（太弱）。
    4、取用神并筛选如下
    日主偏旺 用神取：克、泄、耗。克为土、泄为木不可取因火量不能再旺，但命局中有火水相战，取木通关为吉，耗为火更不可取。所以取土为用神，一来克身制身旺，二来泄旺火，两病同治大吉之神。，但取木时克用神大凶，因水不是太旺，当大运流年变化太旺后，其用神也要同时变化。
    5、吉神与忌神如下：
    吉神：土或木 忌神：火、水、金，
    二、减趋吉避凶方法
    1、在出生地干事最好。少去北方、西方，南，从事与土相关的事业有利。
    2、睡觉床头向东方，不宜向北方、西方，南方。
    3、如多穿衣等颜色为黄色最吉，少穿黑色、红色、白色。
    4、自己所属用的数字如楼层、手机号码尾号等为5或6为好，不用9、0、7、8 、3、4。
    5、名字如能改的话，最后一个字改为五行为土的，要以《康熙字典》为准。
    6、一生要主动行善积德释放正能量，能减轻凶灾和不顺。


    通过运算快速判断四柱八字日主身强、身弱 https://www.douban.com/note/712740612/
    两种简易方法快速判断八字身旺、身衰 https://www.douban.com/note/714255106/
    八字命理：让你一分钟明白克、耗、泄、生、帮？ https://www.douban.com/note/729192920/

  */
    let wxMainCh = wxDay[0] // 日干五行中文
    let wxMainEn = wxMap1[wxMainCh] // 日干五行拼音
    let wxMainCount = wxMap[wxMainEn] // 日干五行数量
    // 生，克，被生，被克
    let s = wxRelation[wxMainEn].s, k = wxRelation[wxMainEn].k, bs = wxRelation[wxMainEn].bs, bk = wxRelation[wxMainEn].bk
    let wxOther = {}, wxOtherMsg = []
    let message = `
      1、排八字：${gzYear}(年柱) ${gzMonth}(月柱) ${gzDay}(日主) ${gzHour}(时柱)
      2、排五行：${wxYear}(年柱) ${wxMonth}(月柱) ${wxDay}(日主) ${wxHour}(时柱)
      3、表面旺弱：命中 ${wxMap.jin}金、${wxMap.mu}木、${wxMap.shui}水、${wxMap.huo}火、${wxMap.tu}土，${wxLack.length ? `五行缺${wxLack.join('，')}` : ''}
      4、实质旺弱：命属${wxMainCh}，`
    for (let key in wxMap) {
      if (key !== wxMainEn) {
        wxOtherMsg.push(`${wxMap2[key]}(${wxMapStrong[key].strong})`)
      }
    }
    // 身强
    let strong = 0, wang = 0
    if (wxMainCount === 0) {
      // 缺少，过弱
      strong = 0
      message += '身过弱'
    } else if (wxMainCount <= 2) {
      // 弱
      strong = 1
      message += '身弱'
    } else if (wxMainCount <= 4) {
      // 强
      strong = 2
      message += '身强'
    } else {
      // 过强
      strong = 3
      message += '身过强'
    }
    // 身旺
    let bsCount = wxMap[bs]
    if (bsCount === 0) {
      // 缺少，过衰
      if (season[gzDay + '-' + lDay]) {
        wang = 2
        message += '身旺'
      } else {
        wang = 0
        message += '身过衰'
      }
    } else if (bsCount <= 2) {
      // 衰
      if (season[gzDay + '-' + lDay]) {
        wang = 2
        message += '身旺'
      } else {
        wang = 1
        message += '身衰'
      }
    } else if (bsCount <= 4) {
      // 旺
      if (season[gzDay + '-' + lDay]) {
        wang = 3
        message += '身过旺'
      } else {
        wang = 2
        message += '身旺'
      }
      wang = season[gzDay + '-' + lDay] ? 3 : 2
    } else {
      // 过旺
      wang = 3
      message += '身过旺'
    }
    let wxLikeUse = wxLikeUseMap[wxMainCh][strong + '-' + wang]
    message += `
      5、日主是${gzDay[0]}五行属水，喜用神：${wxLikeUse.join('，')}`

    let poetryList = await app.mysql.query(`SELECT * FROM name_poetry WHERE off != 1 AND ${typeMap[type] === true ? true : 'type = ?'} ORDER BY rand() LIMIT 20`, [typeMap[type]])
    
    let nameList = await getRandName(app, poetryList, length, wxLikeUse)

    // 获取拼音
    for (let i = 0, len = nameList.length; i < len; i++) {
      let name = nameList[i].name,
        nameStr = '',
        pronounce = [],
        attr = [],
        nameMap = {}
      name.split('').forEach((ele, index) => {
        nameStr += `"${ele}", `
        nameMap[ele] = index
      })
      nameStr = nameStr.substr(0, nameStr.length - 2)
      let res = await app.mysql.query(`SELECT * FROM name_chinese WHERE chinese IN (${nameStr})`)
      res.forEach((ele, index) => {
        res[index].ork = nameMap[ele.chinese] || 0
      })
      res.sort((a, b) => {
        return a.ork - b.ork
      })
      res.forEach(ele => {
        pronounce.push(ele.pronounce.split(',').join(' | '))
        ele.attr ? attr.push(ele.attr) : false
      })
      nameList[i].pronounce = pronounce.join('，')
      nameList[i].attr = attr.join('，')
    }

    ctx.body = { nameInfo: message, nameList }
  }
}

/**
 * 随机取数据
 */
async function getRandName(app, poetryList, length, wxLikeUse) {
  let chinese1 = [], chinese2 = []
  chinese1 = await app.mysql.query('SELECT c.chinese as name FROM name_chinese c WHERE attr = ? AND off != 1', [wxLikeUse[0]])
  chinese1 = chinese1.map(ele => ele.name)
  if (length == 2 && wxLikeUse.length > 1) {
    chinese2 = await app.mysql.query('SELECT c.chinese as name FROM name_chinese c WHERE attr = ? AND off != 1', [wxLikeUse[1]])
    chinese2 = chinese2.map(ele => ele.name)
  }

  let reg1 = new RegExp(`[${chinese1.join('|')}]`, 'g')
  let reg2 = new RegExp(`[${chinese2.join('|')}]`, 'g')
  let nameList = []
  let n = '胸鬼懒禽鸟鸡我邪罪凶丑仇鼠蟋蟀淫秽妹狐鸡鸭蝇悔鱼肉苦犬吠窥血丧饥女搔父母昏狗蟊疾病痛死潦哀痒害蛇牲妇狸鹅穴畜烂兽靡爪氓劫鬣螽毛婚姻匪婆羞辱'.split('')

  for (let i = 0, len = poetryList.length; i < len; i++) {
    let contentList = poetryList[i].verse.split('\n')
    let contentArr = contentList[random(0, contentList.length - 1)].split('。')
    contentArr = contentArr.filter(ele => {
      return ele !== ''
    })
    for (let j = 0; j < contentArr.length; j++) {
      let content = contentArr[j]
      let source = content
      content = content.replace(/[<>《》！*\/\(\^\)\$%~!@#…&%￥—\+=、。，？；‘’“”：·`]/g, '')
      content = content.split('').filter(function(e) {
        return -1 === n.indexOf(e)
      }).join('')
      let res1 = [...new Set(content.match(reg1))]
      if (res1.length === 0) {
        continue
      }
      let index1 = random(0, res1.length - 1), index2 = 0, name1 = res1[index1], name2 = ''
      if (length == 1) {
        // 单名
        nameList.push({
          name: name1,
          source: source,
          ...poetryList[i]
        })
        break
      } else {
        // 双名
        if (wxLikeUse.length > 1) {
          // 多个喜用神
          let res2 = [...new Set(content.match(reg2))]
          if (res2.length === 0) {
            // 随便取一个
            index2 = random(0, content.length - 1)
            name2 = content[index2]
          } else {
            index2 = random(0, res2.length - 1)
            name2 = content[index2]
          }
        } else {
          // 单个喜用神
          // 随便取一个
          index2 = random(0, content.length - 1)
          name2 = content[index2]
        }
        nameList.push({
          name: index2 > index1 ? name1 + name2 : name2 + name1,
          source: source,
          ...poetryList[i]
        })
        break
      }
    }
  }
  return nameList
}

module.exports = HomeController
