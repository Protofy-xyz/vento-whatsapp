const { boardConnect } = require('protonode')
const { Protofy } = require('protobase')

const run = Protofy("code", async ({ context, states, board }) => {
board.execute_action({
  name: "time",
  params: {
    time: 1,
  },
  done: async (value) =>
    board.execute_action({
      name: "system_state",
      params: {
        name: "stop",
      },
    }),
});

setInterval(async () => {
  if (states.system_state == "play") {
    let time = parseInt(states.time, 10);
    time = time + 1;
    board.execute_action({
      name: "time",
      params: {
        time: time,
      },
    });
  }
}, 1000);

})

boardConnect(run)