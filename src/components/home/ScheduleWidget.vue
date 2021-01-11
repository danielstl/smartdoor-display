<template>
  <div class="widget-base">
    <ul>
      <li class="schedule-day" v-for="day in schedule" :key="day.day">
        <div class="day-text">
          <span class="day">{{ day.day }}</span>
          <span class="weekday">{{ day.weekday }}</span>
        </div>
        <ul class="day-events">
          <li v-for="event in day.events" :key="event.title + event.start">
            <div class="event-title">{{ event.title }}</div>
            <div class="event-time">{{ event.start + " - " + event.end }}</div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function mapEpochToTime(epoch) {
  let date = new Date(0);
  date.setUTCMilliseconds(epoch);

  return date.getHours() + ":" + (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
}

export default {
  name: "ScheduleWidget",
  data() {
    return {
      schedule: []
    }
  },
  sockets: {
    calendar_update: function (update) {
      if (update && update.data) {
        let now = new Date();

        console.log(1, now.getTime());

        now.setHours(0, 0, 0, 0);

        console.log(2, now.getTime());

        let newSchedule = [];

        //next 7 days...
        for (let i = 0; i < 7; i++) {
          let startEpoch = now.getTime();
          let endEpoch = startEpoch + 86400000; //1 day in ms

          console.log("->", now, now.getTime());
          console.log(startEpoch, endEpoch);

          //filter to only today's events
          let todaysEvents = update.data.filter(e => /*console.log(e.start, startEpoch) &&*/ e.start >= startEpoch && e.start < endEpoch).map(e => {
            return {
              title: e.name,
              start: mapEpochToTime(e.start),
              end: mapEpochToTime(e.end)
            }
          });

          if (todaysEvents.length > 0) { //if we have events today
            newSchedule.push(
                {
                  day: now.getDate(), //day of month
                  weekday: weekdays[now.getDay() - 1], //day of week
                  events: todaysEvents
                }
            );
          }

          now.setDate(now.getDate() + 1); //add 1 day
        }

        this.schedule = newSchedule;

      } else {
        this.schedule = [];
      }
    }
  },
  mounted() {
    this.$socket.emit("get_calendar");
    //fetch("http://localhost:3000/schedule", {mode: "no-cors"}).then(r => console.log(r)).then(r => r.json()).then(r => console.log(r));//.then(r => this.schedule = r);
  }
}
</script>

<style scoped>
.schedule-day {
  list-style: none;
  display: flex;
  margin: 5px 10px;
}

.day-text {
  width: max(10%, 50px);
  text-align: center;
  font-size: 1.1em;
  padding-right: 5px;
  margin-bottom: 3px;
}

.day {
  font-weight: 550;
  font-size: 1.3em;
}

.weekday {
  display: block;
  font-weight: 450;
}

.day-events {
  flex: 1;
  list-style: none;
  font-size: 1.2em;
}

.schedule-day:not(:last-child) {
  border-bottom: 2px solid #ccc;
}

.day-events > li {
  background-color: #4141ff;
  color: white;
  border-radius: 10px;
  padding: 6px;
  margin: 0 0 5px 0;
}

ul {
  padding: 0;
}

.event-title {
  font-weight: 600;
}
</style>
