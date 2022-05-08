// 写法与vue3一样
import {createApp} from '../../lib/my-mini-vue.esm.js';
import { App } from "./App.js";

const rootCotainter = document.querySelector("#app")
createApp(App).mount(rootCotainter );