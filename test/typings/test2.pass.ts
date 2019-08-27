/// <reference path="../../src/types.d.ts" />

import Bootstrap from "libp2p-bootstrap";
const bootstrap1 = new Bootstrap({list: ["item"], interval: 1})
bootstrap1.start()
bootstrap1.stop()