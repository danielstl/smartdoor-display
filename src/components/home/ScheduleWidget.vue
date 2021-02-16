<template>
  <div class="widget-base" id="schedule-widget">
    <EventDetailsOverlay v-if="focusedEvent !== null" :event="focusedEvent" @close="showEventDetails(null)"/>
    <ul>
      <li class="schedule-day" v-for="day in schedule" :key="day.day">
        <div class="day-text">
          <span class="day">{{ day.day }}</span>
          <span class="weekday">{{ day.weekday }}</span>
        </div>
        <ul class="day-events">
          <li v-for="event in day.events" :key="event.title + event.start" @click="showEventDetails(event)" :style="{ 'background-color': event.colour}">
            <div class="event-title">{{ event.title }}</div>
            <div class="event-time">{{ event.start + " - " + event.end }}</div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import EventDetailsOverlay from "@/components/home/EventDetailsOverlay";
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function mapEpochToTime(epoch) {
  let date = new Date(0);
  date.setUTCMilliseconds(epoch);

  return date.getHours() + ":" + (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
}

export default {
  name: "ScheduleWidget",
  components: {EventDetailsOverlay},
  data() {
    return {
      schedule: [],
      focusedEvent: null,
      calUpdateHandle: 0
    }
  },
  methods: {
    showEventDetails(event) {
      this.focusedEvent = event;
    },
    getCalendar() {
      this.$socket.emit("get_calendar");
    }
  },
  beforeDestroy() {
    clearInterval(this.calUpdateHandle);
  },
  sockets: {
    calendar_update: function (update) {
      if (update && update.length > 0) {

        let flatEvents = [];

        for (let calendar of update) {
          for (let event of calendar.events) {
            flatEvents.push({
              colour: calendar.colour,
              ...event
            });
          }
        }

        console.log(flatEvents);

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
          let todaysEvents = flatEvents.filter(e => /*console.log(e.start, startEpoch) &&*/ e.start >= startEpoch && e.start < endEpoch).sort((a, b) => a.start - b.start).map(e => {
            return {
              title: e.name,
              colour: e.colour,
              start: mapEpochToTime(e.start),
              startEpoch: e.start,
              endEpoch: e.end,
              end: mapEpochToTime(e.end)
            }
          });

          if (todaysEvents.length > 0) { //if we have events today
            newSchedule.push(
                {
                  day: now.getDate(), //day of month
                  weekday: weekdays[now.getDay()], //day of week
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
    this.calUpdateHandle = setInterval(this.getCalendar, 5 * 60 * 1000); //every 5 min

    this.getCalendar();
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
  --background-color: #4141ff;
  color: white;
  border-radius: 10px;
  padding: 6px;
  margin: 0 0 5px 0;

  cursor: pointer;
}

ul {
  padding: 0;
}

.event-title {
  font-weight: 600;
}

#schedule-widget {
  overflow-y: scroll;
}
</style>
