import Mux from '@mux/mux-node'

// Initialize MUX client
const mux = new Mux(
  process.env.MUX_TOKEN_ID!,
  process.env.MUX_TOKEN_SECRET!
)

export default mux
