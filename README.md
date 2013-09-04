winston-mixlib-log
==================

A clone of ruby's mixlib-log output for [winston](https://github.com/flatiron/winston)

Example:

`[2012-10-12T10:45:03-07:00] INFO: Expected output should look something like this.`

Also supports objects like so:

@logger.info {
  m: "create_user"
  username: "seryl"
}

`{"m":"create_user","username":"seryl","s":"info","time":"2013-09-04T19:09:11-07:00"}`
