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
export default {
  name: "ScheduleWidget",
  data() {
    return {
      schedule: [
        {
          day: 16,
          weekday: "Mon",
          events: [
            {
              title: "SCC.311",
              start: "12:00",
              end: "13:00"
            },
            {
              title: "SCC.311",
              start: "15:00",
              end: "16:00"
            }
          ]
        },
        {
          day: 17,
          weekday: "Tue",
          events: [
            {
              title: "SCC.311",
              start: "14:00",
              end: "16:00"
            }
          ]
        },
        {
          day: 18,
          weekday: "Wed",
          events: [
            {
              title: "SCC.306",
              start: "9:00",
              end: "11:00"
            },
            {
              title: "SCC.361",
              start: "12:00",
              end: "14:00"
            },
            {
              title: "SCC.306",
              start: "14:00",
              end: "16:00"
            }
          ]
        }
      ]
    }
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