node-adjuster
===

validate and adjust input values

## How to use

install by npm.
```bash
npm install -S adjuster
```

### number

```javascript
import adjuster from "adjuster";

// should be OK
adjuster.number().adjust(-123);          // === -123;
adjuster.number().in(1, 3, 5).adjust(1); // === 1

// should be adjusted
adjuster.number().adjust("-123");                  // === -123;
adjuster.number().default(10).adjust(undefined);   // === 10
adjuster.number().allowEmpty(123).adjust("");      // === 123
adjuster.number().minValue(1, true).adjust(0);     // === 1
adjuster.number().maxValue(100, true).adjust(101); // === 100

// should cause errors
adjuster.number().adjust(undefined);         // throws AdjusterError; err.cause === adjuster.CAUSE.REQUIRED
adjuster.number().adjust(undefined, (err) => { // ...or catch by callback function
    return 10; // returns a value from adjust() method
}); // === 10
adjuster.number().adjust("abc");             // throws AdjusterError; err.cause === adjuster.CAUSE.TYPE
adjuster.number().adjust("");                // throws AdjusterError; err.cause === adjuster.CAUSE.EMPTY
adjuster.number().in(1, 3, 5).adjust(2);     // throws AdjusterError; err.cause === adjuster.CAUSE.IN
adjuster.number().minValue(1).adjust(0);     // throws AdjusterError; err.cause === adjuster.CAUSE.MIN_VALUE
adjuster.number().maxValue(100).adjust(101); // throws AdjusterError; err.cause === adjuster.CAUSE.MAX_VALUE
```

### string

```javascript
import adjuster from "adjuster";

// should be OK
adjuster.string().adjust("123");                              // === "123"
adjuster.string().allowEmpty("xyz").adjust("");               // === "xyz"
adjuster.string().in("eat", "sleep", "play").adjust("sleep"); // === "sleep"

// should be adjusted
adjuster.string().adjust(123);                          // === "123"
adjuster.string().default("xyz").adjust(undefined);     // === "xyz"
adjuster.string().maxLength(5, true).adjust("abcdefg"); // === "abcde"

// should cause errors
adjuster.string().adjust(undefined); // throws AdjusterError; err.cause === adjuster.CAUSE.REQUIRED
adjuster.string().adjust(""); // throws AdjusterError; err.cause === adjuster.CAUSE.EMPTY
adjuster.string().in("eat", "sleep", "play").adjust("study"); // throws AdjusterError; err.cause === adjuster.CAUSE.IN
adjuster.string().minLength(5).adjust("a"); // throws AdjusterError; err.cause === adjuster.CAUSE.MIN_LENGTH
adjuster.string().maxLength(5).adjust("abcdefg"); // throws AdjusterError; err.cause === adjuster.CAUSE.MAX_LENGTH
```

### IPv4

```javascript
import adjuster from "adjuster";

// should be OK
adjuster.ipv4().adjust("0.0.0.0");          // === "0.0.0.0"
adjuster.ipv4().adjust("192.168.0.1");      // === "192.168.0.1"
adjuster.ipv4().adjust("255.255.255.255");  // === "255.255.255.255"

// should cause errors; err.cause === adjuster.CAUSE.IPV4
adjuster.ipv4().adjust("0.0.0.");
adjuster.ipv4().adjust("0.0.0.0.");
adjuster.ipv4().adjust("255.255.255.256");
```

### IPv6

```javascript
import adjuster from "adjuster";

// should be OK
adjuster.ipv6().adjust("0000:0000:0000:0000:0000:0000:0000:0000");  // === "0000:0000:0000:0000:0000:0000:0000:0000"
adjuster.ipv6().adjust("::1");                                      // === "::1"
adjuster.ipv6().adjust("::");                                       // === "::"
adjuster.ipv6().adjust("1::1");                                     // === "1::1"
adjuster.ipv6().adjust("::ffff:192.0.2.1");                         // === "::ffff:192.0.2.1"; IPv4-mapped address

// should cause errors; err.cause === adjuster.CAUSE.IPV6
adjuster.ipv6().adjust("0000");
adjuster.ipv6().adjust("ffff:");
adjuster.ipv6().adjust("0000:0000:0000:0000:0000:0000:0000:0000:");
```

### e-mail

```javascript
import adjuster from "adjuster";

// should be OK
adjuster.email().adjust("user+mailbox/department=shipping@example.com"); // === "user+mailbox/department=shipping@example.com"; dot-string
adjuster.email().adjust("!#$%&'*+-/=?^_`.{|}~@example.com");             // === "!#$%&'*+-/=?^_`.{|}~@example.com"; dot-string
adjuster.email().adjust("\"Fred\\\"Bloggs\"@example.com");               // === "\"Fred\\\"Bloggs\"@example.com"; quoted-string
adjuster.email().adjust("\"Joe.\\\\Blow\"@example.com");                 // === "\"Joe.\\\\Blow\"@example.com"; quoted-string
adjuster.email().adjust("user@example-domain.com");                      // === "user@example-domain.com"
adjuster.email().adjust("user@example2.com");                            // === "user@example2.com"

// should cause errors; err.cause === adjuster.CAUSE.EMAIL
adjuster.email().adjust("@example.com");
adjuster.email().adjust(".a@example.com");
adjuster.email().adjust("a.@example.com");
adjuster.email().adjust("a..a@example.com");
adjuster.email().adjust("user@example@com");
adjuster.email().adjust("user-example-com");
adjuster.email().adjust("user@example_domain.com");
adjuster.email().adjust("user@example.com2");
```

### multiple data

```javascript
import adjuster from "adjuster";

const inputData = {
    id: "1",
    name: "Pablo Diego José Francisco de Paula Juan Nepomuceno María de los Remedios Ciprin Cipriano de la Santísima Trinidad Ruiz y Picasso",
    email: "picasso@example.com",
    state: "active",
    remote_addr: "127.0.0.1",
    remote_addr_ipv6: "::1",
    limit: "0",
};
const adjusters = {
    id: adjuster.number().minValue(1),
    name: adjuster.string().maxLength(16, true),
    email: adjuster.email(),
    state: adjuster.string().in("active", "inactive"),
    remote_addr: adjuster.ipv4(),
    remote_addr_ipv6: adjuster.ipv6(),
    limit: adjuster.number().default(10).minValue(1, true).maxValue(100, true),
    offset: adjuster.number().default(0).minValue(0, true),
};
const expected = {
    id: 1,
    name: "Pablo Diego José",
    email: "picasso@example.com",
    state: "active",
    remote_addr: "127.0.0.1",
    remote_addr_ipv6: "::1",
    limit: 1,
    offset: 0,
};

const adjusted = adjuster.adjustData(inputData, adjusters);
// expect(adjusted).toEqual(expected);
```

## Release notes

* 2018/05/06 *version 0.4.0*
    * New Functions
        * `adjuster.ipv4()`
        * `adjuster.ipv6()`
    * Change Specifications
        * strict IPv4 and IPv6 validation for `adjuster.email()`
* 2018/04/22 *version 0.3.0*
    * Bugfixes
        * quoted-pair of email
        * import error in `EmailAdjuster.es`
    * Change Specifications
        * limit the length of local/domain part of email
* 2018/04/21 *version 0.2.0*
    * Bugfixes
        * test error on npm@5
    * Change Specifications
        * enable to specify value to `allowEmpty()`
        * support IPv6 domain for `EmailAdjuster`
* 2018/04/18 *version 0.1.0*
    * First release.
