/* eslint-disable object-shorthand */
/* eslint-disable no-undef */
const request = require("supertest");
const cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");

let server, agent;
function extractCsrfToken(res) {
  const $ = cheerio.load(res.text);
  return $("[name = _csrf]").val();
}

const login = async (agent, username, password) => {
  let res = await agent.get("/login");
  const csrfToken = extractCsrfToken(res);
  res = await agent.post("/session").send({
    email: username,
    password: password,
    _csrf: csrfToken,
  });
};

describe("Sports Scheduler ", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4090, () => {
      console.log("Started Express application at port 4090");
    });
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  test("Sign up as admin", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
      firstname: "user1",
      lastname: "user",
      email: "user.1@test.com",
      password: "123456789",
      role: "admin",
      _csrf: csrfToken,
    });
    expect(res.statusCode).toBe(302);
  });
  test("Sign up as player", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractCsrfToken(res);
    res = await agent.post("/users").send({
      firstname: "user2",
      lastname: "user",
      email: "user.2@test.com",
      password: "123456789",
      role: "player",
      _csrf: csrfToken,
    });
    expect(res.statusCode).toBe(302);
  });
  // test('Login as Admin', async () => {
  //   let res = await agent.get('/login')
  //   const csrfToken = extractCsrfToken(res)
  //   res = await agent.post('/session').send({
  //     email: 'user.1@test.com',
  //     password: '123456789',
  //     _csrf: csrfToken
  //   })
  //   expect(res.statusCode).toBe(302)
  // })
  // test('Login as a player', async () => {
  //   const res = await agent.post('/users').send({
  //     firstname: 'user2',
  //     lastname: 'user',
  //     email: 'user.2@test.com',
  //     password: '123456789',
  //     role: 'player'
  //   })
  //   expect(res.statusCode).toBe(302)
  //   const loginRes = await agent.post('/login').send({
  //     email: 'user.2@test.com',
  //     password: '123456789'
  //   })
  //   expect(loginRes.statusCode).toBe(302)
  //   expect(loginRes.header.location).toBe('/')
  // })

  test("Sign out", async () => {
    let res = await agent.get("/admin");
    expect(res.statusCode).toBe(200);
    res = await agent.get("/signout");
    expect(res.statusCode).toBe(302);
    res = await agent.get("/admin");
    expect(res.statusCode).toBe(302);
  });

  test("Creating a sport as Admin", async () => {
    const agent = request.agent(server);
    await login(agent, "user.1@test.com", "123456789");
    const res = await agent.get("/createsport");
    const csrfToken = extractCsrfToken(res);
    const response = await agent.post("/createsport").send({
      sport_name: "tennis",
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
  });
});
