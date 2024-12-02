import { strict as assert } from "node:assert";
import { test } from "node:test";

import { clargs } from "./index.js";

test("none", () => {

    let args = clargs([]);
    
    assert(!args.next());
});

test("unnamed", () => {

    let args = clargs(["apples"]);
    
    assert(args.next());
    assert.equal(args.name, null);
    assert.equal(args.value, "apples");
    assert(!args.next());
});

test("unnamed x2", () => {

    let args = clargs(["apples", "pears"]);
    
    assert(args.next());
    assert.equal(args.name, null);
    assert.equal(args.value, "apples");

    assert(args.next());
    assert.equal(args.name, null);
    assert.equal(args.value, "pears");
    assert(!args.next());
});

test("switch", () => {

    let args = clargs(["--switch"]);
    
    assert(args.next());
    assert.equal(args.name, "switch");
    assert.equal(args.value, null);
});



test("named value", () => {

    let args = clargs(["--name=value"]);
    
    assert(args.next());
    assert.equal(args.name, "name");
    assert.equal(args.value, "value");
});

test("short switches", () => {

    let args = clargs(["-abc"]);
    
    assert(args.next());
    assert.equal(args.name, "a");
    assert(args.next());
    assert.equal(args.name, "b");
    assert(args.next());
    assert.equal(args.name, "c");
});

test("short switch + short named value", () => {

    let args = clargs(["-abvalue"]);

    assert(args.next());
    assert.equal(args.name, "a");
    
    assert(args.next());
    assert.equal(args.name, "b");
    assert.equal(args.value, "value");
    assert(!args.next());
});

test("short switch + separated value", () => {

    let args = clargs(["-a=value"]);

    assert(args.next());
    assert.equal(args.name, "a");
    assert.equal(args.value, "value");
    assert(!args.next());
});


test("unexpected value", () => {

    let args = clargs(["-a=value", "b"]);

    assert(args.next());
    assert.equal(args.name, "a");

    assert.throws(() => args.next());
});


test("switch off value", () => {

    let args = clargs(["--switch=off"]);

    assert(args.next());
    assert.equal(args.name, "switch");
    assert.equal(args.boolValue, false);
    assert.throws(() => args.next());
});

test("switch on value", () => {

    let args = clargs(["--switch=on"]);

    assert(args.next());
    assert.equal(args.name, "switch");
    assert.equal(args.boolValue, true);
    assert.throws(() => args.next());
});

test("switch false value", () => {

    let args = clargs(["--switch=false"]);

    assert(args.next());
    assert.equal(args.name, "switch");
    assert.equal(args.boolValue, false);
    assert.throws(() => args.next());
});

test("switch true value", () => {

    let args = clargs(["--switch=true"]);

    assert(args.next());
    assert.equal(args.name, "switch");
    assert.equal(args.boolValue, true);
    assert.throws(() => args.next());
});

test("switch no value", () => {

    let args = clargs(["--switch=no"]);

    assert(args.next());
    assert.equal(args.name, "switch");
    assert.equal(args.boolValue, false);
    assert.throws(() => args.next());
});

test("switch yes value", () => {

    let args = clargs(["--switch=yes"]);

    assert(args.next());
    assert.equal(args.name, "switch");
    assert.equal(args.boolValue, true);
    assert.throws(() => args.next());
});


test("integer value", () => {

    let args = clargs(["--val=23"]);

    assert(args.next());
    assert.equal(args.name, "val");
    assert.equal(args.intValue, 23);
    assert(!args.next());
});

test("hex value", () => {

    let args = clargs(["--val=0x23"]);

    assert(args.next());
    assert.equal(args.name, "val");
    assert.equal(args.intValue, 35);
    assert(!args.next());
});


test("integer value throws", () => {

    let args = clargs(["--val=abc"]);

    assert(args.next());
    assert.equal(args.name, "val");
    assert.throws(() => args.intValue);
});


test("one-of", () => {

    let args = clargs(["--val=apples"]);

    assert(args.next());
    assert.equal(args.name, "val");
    assert.equal(args.oneOfValue("apples,pears,bananas"), "apples");
});

test("one-of throws", () => {

    let args = clargs(["--val=berries"]);

    assert(args.next());
    assert.equal(args.name, "val");
    assert.throws(() => args.oneOfValue("apples,pears,bananas"));
});


test("terminator", () => {

    let args = clargs(["--"]);

    assert(args.next());
    assert.equal(args.name, "--");
    assert(!args.next());
});

test("command tail", () => {

    let args = clargs(["command", "a", "b", "c"]);

    assert(args.next());
    assert.equal(args.name, null);
    assert.equal(args.value, "command");
    assert.deepStrictEqual(args.tail, [ "a", "b", "c" ]);
    assert(!args.next());
});


test("delimited tail", () => {

    let args = clargs(["--", "a", "b", "c"]);

    assert(args.next());
    assert.equal(args.name, "--");
    assert.deepStrictEqual(args.tail, [ "a", "b", "c" ]);
    assert(!args.next());
});

