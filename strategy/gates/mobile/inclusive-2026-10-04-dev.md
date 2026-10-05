# Mobile inclusive forms gate 2026-10-04

Base: http://localhost:3461  Checks: 39 of 43 pass  Problems: 4

## Problems

- 390x844 wizard access field is in view when focused 
- 390x844 wholesale message has "+447911123456" 
- 390x844 wholesale message has "A tender for a county office" 
- 390x844 wholesale message has "Help filling this in please" 

## Checks

| Device | Check | Result | Note |
|---|---|---|---|
| 390x844 | 8 order types can be selected, no cap text | PASS | 8 |
| 390x844 | 44px targets: studio chips and cards | PASS |  |
| 390x844 | no sideways scroll: studio who | PASS | 0px |
| 390x844 | 12 pieces added | PASS |  |
| 390x844 | no sideways scroll: studio 12 pieces | PASS | 0px |
| 390x844 | an exact quantity of five digits is kept | PASS |  |
| 390x844 | 8 delivery addresses | PASS | 8 |
| 390x844 | no sideways scroll: studio 8 addresses | PASS | 0px |
| 390x844 | all 47 counties in the county list | PASS | 143 |
| 390x844 | access field is in view when focused (keyboard open) | PASS |  |
| 390x844 | 44px targets: contact chips | PASS |  |
| 390x844 | no sideways scroll: studio contact | PASS | 0px |
| 390x844 | validation message in view after Send without terms | PASS |  |
| 390x844 | the link text (short level) still names the ref and every piece | PASS | 1055 chars |
| 390x844 | the copied message names every one of the 12 pieces | PASS | 0 missing |
| 390x844 | message has "Other: Book club" | PASS |  |
| 390x844 | message has "Other: A puppet for a play" | PASS |  |
| 390x844 | message has "+447911123456" | PASS |  |
| 390x844 | message has "Other: Signal" | PASS |  |
| 390x844 | message has "Large print messages please" | PASS |  |
| 390x844 | message has "Leeds, United Kingdom" | PASS |  |
| 390x844 | no sideways scroll: studio sent | PASS | 0px |
| 390x844 | 44px targets: wizard who | PASS |  |
| 390x844 | no sideways scroll: wizard who | PASS | 0px |
| 390x844 | wizard access field is in view when focused | FAIL |  |
| 390x844 | no sideways scroll: wizard details | PASS | 0px |
| 390x844 | split delivery to 8 places | PASS | 8 |
| 390x844 | county list has all 47 counties | PASS |  |
| 390x844 | no sideways scroll: wizard 8 places | PASS | 0px |
| 390x844 | the animals list inside each place scrolls instead of growing | PASS |  |
| 390x844 | wizard validation message is in view | PASS |  |
| 390x844 | the order wizard moved on or explained why (every place needs an animal) | PASS | 14 messages |
| 390x844 | wholesale reply-preferences field in view | PASS |  |
| 390x844 | 44px targets: wholesale checks | PASS |  |
| 390x844 | no sideways scroll: wholesale | PASS | 0px |
| 390x844 | wholesale message has "+447911123456" | FAIL |  |
| 390x844 | wholesale message has "A tender for a county office" | FAIL |  |
| 390x844 | wholesale message has "Help filling this in please" | FAIL |  |
| 390x844 | no sideways scroll: wholesale sent | PASS | 0px |
| 390x844 | gift finder holds 10 people | PASS | 10 |
| 390x844 | 44px targets: gift finder buttons | PASS |  |
| 390x844 | no sideways scroll: gift finder 10 people | PASS | 0px |
| 390x844 | the share message has a block for person 10 | PASS | 2212 chars |
