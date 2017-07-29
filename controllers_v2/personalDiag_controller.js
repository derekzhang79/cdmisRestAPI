// var PersonalDiag = require('../models/personalDiag')
var Alluser = require('../models/alluser')

// exports.test = function () {
//   console.log(new Date())
// }

// 每日更新所有医生两周后当天的面诊可预约 YQC 2017-07-29 // 还需添加停诊判断
exports.autoAvailablePD = function (req, res) {
  // console.log(new Date())
  let today = new Date(new Date().toDateString())
  let twoWeeksLater = new Date(today)
  twoWeeksLater.setDate(twoWeeksLater.getDate() + 14)
  let todayNo = new Date().toDateString().split(' ')[0]
  // console.log(todayNo)
  let query = {'serviceSchedules.day': todayNo}
  Alluser.getSome(query, function (err, items) {
    if (err) {
      console.log(err)
    } else {
      if (items.length === 0) {
        console.log('auto_available_personal_diagnosis_update_complete-0')
      } else {
        for (let i = 0; i < items.length; i++) {
          let itemDoc = items[i]
          let sSDoc = itemDoc.serviceSchedules
          // let timeToUpdate = []
          for (let j = 0; j < sSDoc.length; j++) {
            if (sSDoc[j].day === todayNo) {
              // timeToUpdate.push(sSDoc[j].time)
              let doctorId = itemDoc.userId
              let queryD = {userId: doctorId}
              let upObj = {
                $addToSet: {
                  availablePDs: {
                    availableTime: sSDoc[j].time,
                    availableDay: twoWeeksLater,
                    total: sSDoc[j].total
                  }
                }
              }
              Alluser.update(queryD, upObj, function (err, upItem) {
                if (err) {
                  console.log(err)
                } else if (upItem.nModified === 1) {
                  console.log(doctorId + '-' + twoWeeksLater.toDateString() + '-' + sSDoc[j].time + '-PD-Auto-Update-Complete-1')
                } else {
                  console.log(doctorId + '-' + twoWeeksLater.toDateString() + '-' + sSDoc[j].time + '-PD-Auto-Update-Complete-0')
                }
              })
            }
          }
        }
        console.log('auto_available_personal_diagnosis_update_complete-all')
      }
    }
  })
}
