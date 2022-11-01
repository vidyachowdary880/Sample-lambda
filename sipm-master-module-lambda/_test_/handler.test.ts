//import { Context } from 'aws-lambda';
import { init } from './../src/handler';
import * as resource from './resources/resource.json';
const MockContext = require('mock-lambda-context');
import { Service } from "../src/service"
import * as eventObj from "./resources/gateWayEventTest.json";
//import * as operationsJson from '../src/resources/operations.json';
//import * as contextName from "./resources/context.json";
const ctx = new MockContext();




describe('handler', () => {
  var requestPayload = resource.event;

  test('handler test', () => {

    jest.spyOn(Service, "getOrganizationService").mockImplementation(() => { return new Promise((resolve) => { resolve({}) }) });
    init(requestPayload, ctx, (err, data: any) => {
      console.log(data, err);
    });
  });


  test('handler test2', () => {

    jest.spyOn(Service, "createOrganizationRecord").mockImplementation(() => { return new Promise((resolve) => { resolve({}) }) });
    init(resource.deleteEvent, ctx, (err, data: any) => {
      console.log(data, err);
    });
  });

  test('handler test3', () => {

    jest.spyOn(Service, "createGroup").mockImplementation(() => { return new Promise((resolve) => { resolve({}) }) });
    init(eventObj.groupCreateEvent, ctx, (err, data: any) => {
      console.log(data, err);
    });
  });
  test('handler test4', () => {

    jest.spyOn(Service, "createPhase").mockImplementation(() => { return new Promise((resolve) => { resolve({}) }) });
    init(eventObj.phaseCreateEvent, ctx, (err, data: any) => {
      console.log(data, err);
    });
  });
  test('handler test4', () => {

    jest.spyOn(Service, "deleteOrganization").mockImplementation(() => { return new Promise((resolve) => { resolve({}) }) });
    init(resource.deleteEvent, ctx, (err, data: any) => {
      console.log(data, err);
    });
  });
  test('handler test5', () => {

    jest.spyOn(Service, "updateOrganization").mockImplementation(() => { return new Promise((resolve) => { resolve({}) }) });
    init(resource.updateOrgEvent, ctx, (err, data: any) => {
      console.log(data, err);
    });
  });

  test('handler test6', () => {

    jest.spyOn(Service, "updateOrganization").mockImplementation(() => { return new Promise((resolve) => { resolve({}) }) });
    init(resource.updateOrgEventError, ctx, (err, data: any) => {
      console.log(data, err);
    });
  });

  test('handler test7', () => {

    jest.spyOn(Service, "updatePhase").mockImplementation(() => { return new Promise((resolve) => { resolve({}) }) });
    init(eventObj.phaseUpdateEvent, ctx, (err, data: any) => {
      console.log(data, err);
    });
  });

  test('handler test8', () => {

    jest.spyOn(Service, "deletePhase").mockImplementation(() => { return new Promise((resolve) => { resolve({}) }) });
    init(eventObj.phaseDeleteEvent, ctx, (err, data: any) => {
      console.log(data, err);
    });

  });

  test('handler test9', () => {

    jest.spyOn(Service, "updateGroup").mockImplementation(() => { return new Promise((resolve) => { resolve({}) }) });
    init(eventObj.groupUpdateEvent, ctx, (err, data: any) => {
      console.log(data, err);
    });

  });

  test('handler test10', () => {

    jest.spyOn(Service, "deleteGroup").mockImplementation(() => { return new Promise((resolve) => { resolve({}) }) });
    init(eventObj.groupDeleteEvent, ctx, (err, data: any) => {
      console.log(data, err);
    });

  });





});
