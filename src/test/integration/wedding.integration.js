/* global describe, before, after, it */
import Promise from "bluebird";
import request from "supertest";
import httpStatus from "http-status";
import chai, {expect} from "chai";
import app from "../../main/index";
import omit from "lodash/omit";
import {anAccount, setUpAccounts, tearDownAccounts} from "../data/accounts.data";
import { setUpWeddings, tearDownWeddings, aBlueWedding } from "../data/wedding.data";
import {smallUser, bigUser, setUpUsers, tearDownUsers} from "../data/users.data";
import {getTokenFor} from "../utils/auth.utils";

describe("Wedding", () => {

  let token;

  before(() => Promise.join(
    setUpAccounts(anAccount()
      .withUser(bigUser).build()),
    setUpUsers(bigUser, smallUser),
    setUpWeddings(aBlueWedding()
      .withParticipants({
        bride: smallUser,
        groom: bigUser
      })
      .build()),
    (account) => {
      token = getTokenFor(account);
    }
  ));

  after(() => Promise.join(
    tearDownWeddings(),
    tearDownAccounts(),
    tearDownUsers(),
  ));

  describe("GET /api/wedding", () => {

    it("can get wedding", () =>
      request(app)
        .get("/api/wedding")
        .set("token", token)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(omit(res.body, "_id",
            "guests[0]._id",
            "guests[1]._id",
            "participants.bride._id",
            "participants.groom._id"
          )).to.deep.equal({
            "guests": [
              {
                "firstName": "firstNameA",
                "lastName": "lastNameA"
              },
              {
                "firstName": "firstNameB",
                "lastName": "lastNameB"
              }
            ],
            "participants": {
              "bride": {
                "username": "bigUsername",
                "firstName": "bigFirstName",
                "lastName": "bigLastName",
                "status": "active",
                "actors": []
              },
              "groom": {
                "username": "smallUsername",
                "firstName": "smallFirstName",
                "lastName": "smallLastName",
                "status": "active",
                "actors": []
              }
            }
          });
        })
    );

  });

});

chai.config.includeStack = true;
