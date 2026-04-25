import { state } from "../state.js";
import { fmtDate } from "../utils.js";
import { render } from "../main.js";

export function renderLogin() {
  state.root.innerHTML = `
  <div class="login-wrap">
    <div class="login-card">
      <div class="leaf-decor">❦</div>
      <h1>Our <em>little</em> garden</h1>
      <div class="sub">— a private place, just for us —</div>
      <form id="loginForm">
        <input type="password" class="pwd-input" id="pwd" placeholder="• • • • • • • •" autocomplete="off" autofocus>
        <div class="err" id="err"></div>
        <div class="pwd-hint">the day we began (ddmmyyyy)</div>
        <button type="submit" class="btn" style="margin-top:26px;width:100%;justify-content:center">Enter</button>
      </form>
      <div class="login-foot">EST. ${fmtDate(Store.get().couple.anniversary).toUpperCase()}</div>
    </div>
  </div>`;
  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const entered = document.getElementById("pwd").value.replace(/\D/g, "");
    const anniv = Store.get().couple.anniversary;
    const [y, m, dy] = anniv.split("-");
    const expected = `${dy}${m}${y}`;
    const expectedAlt = `${y}${m}${dy}`;
    const expectedAlt2 = `${dy}${m}${y.slice(2)}`;
    if (entered === expected || entered === expectedAlt || entered === expectedAlt2) {
      Store.unlock();
      location.hash = "#/home";
      render();
    } else {
      document.getElementById("err").textContent = "not quite — try the date we began";
      document.getElementById("pwd").value = "";
    }
  });
}
