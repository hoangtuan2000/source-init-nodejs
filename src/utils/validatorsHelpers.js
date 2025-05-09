const momentTimezone = require("moment-timezone");

const validate = {
  startTime(value) {
    const today = momentTimezone
      .tz(momentTimezone(), "Asia/Ho_Chi_Minh")
      .startOf("hours");
    console.warn("today", today);

    const startTime = momentTimezone
      .tz(value, "Asia/Ho_Chi_Minh")
      .startOf("hours");
    if (startTime.isBefore(today, "hours")) {
      throw new Error("Thời gian bắt đầu phải là ngày giờ hiện tại trở đi");
    }
  },
  endTime(value) {
    const today = momentTimezone
      .tz(momentTimezone(), "Asia/Ho_Chi_Minh")
      .startOf("hours");
    const endTime = momentTimezone
      .tz(value, "Asia/Ho_Chi_Minh")
      .startOf("hours");
    if (endTime.isBefore(today, "hours")) {
      throw new Error("Thời gian kết thúc phải là ngày giờ hiện tại trở đi");
    }
  },
};

module.exports = validate;
