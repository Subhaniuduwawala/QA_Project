import dotenv from "dotenv";
dotenv.config();
import request from "supertest";
import { expect } from "chai";
import app from "../app.js";
import mongoose from "mongoose";

describe("Event API", function () {
  let eventId;

 before(async function () {
  // Connect to your main database
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }

  // Optional: clear only the events collection
  await mongoose.connection.collection("events").deleteMany({});
});

after(async function () {
  await mongoose.connection.close();
});

  it("should create a new event", async function () {
    const res = await request(app)
      .post("/api/events")
      .send({
        name: "Test Event",
        location: "Test Hall",
        date: "2025-09-01T10:00:00.000Z",
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("success", true);
    expect(res.body.data).to.have.property("_id");
    eventId = res.body.data._id;
  });

  it("should get all events", async function () {
    const res = await request(app).get("/api/events");

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("success", true);
    expect(res.body).to.have.property("count").that.is.a("number");
    expect(res.body).to.have.property("data").that.is.an("array");
  });

  it("should get event by ID", async function () {
    const res = await request(app).get(`/api/events/${eventId}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("success", true);
    expect(res.body.data).to.have.property("_id", eventId);
  });
});
