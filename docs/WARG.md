# Warg

The warg enemy (`warg`, Characters → Enemies → Brutes): a huge hyena-like wolf. Code: `src/characters/warg.js`.

Open it: `http://localhost:<port>/#/a/warg`

## Options

| Option | Choices (default first) |
|---|---|
| Coat | Random, Dark grey, Black, Brown, Dusty tan, Grey-brown, Pale grey |
| Markings | Random, None, Spots (hyena), Stripes (brindle), Dark saddle |
| Mane | Random, Crest (dark ridge down the neck and back), Shaggy (ruff, thick neck, bushier tail) |
| Ears | Random, Pointed, Round (hyena), Torn (left ear missing its tip) |
| Eyes | Yellow, Red, Green, Pale (glowing) |
| Scars | Random, Yes (over the right eye, muzzle, three claw marks on the left flank), No |
| Gear | None, Spiked collar, Collar and saddle (blanket, girth, seat, stirrups for a rider) |

"New look" rolls every Random option; the saddle blanket colour is rolled too.

## Body

About 3.3 m long, 1.6 m at the withers, 1.9 m to the ear tips. Deep chest with a withers hump, the back sloping down to a lower, narrower rump (long forelegs, shorter hind legs). Heavy head: brow ridge, long muzzle, nose, upper fangs, teeth, tongue and dark mouth inside, opening lower jaw. Paws have dark pads and three claws. Lighter throat, chest and belly.

Rig (24 joints): `body` → `chest` and `hips` (split spine); front legs `leg_F*` (shoulder), `knee_F*` (elbow), `paw_F*` (wrist); hind legs `leg_B*` (hip), `knee_B*` (stifle), `hock_B*`, `paw_B*`; `neck`, `head`, `jaw`, `ear_L/R`, `tail`, `tail2`. Every joint sits in a rest group, so clip angles are offsets from the rest pose.

## Clips

15 clips, FK poses in degrees sampled at 30 fps by `wgClip`. Every frame is grounded on the lowest point of the model (all box corners), and most clips also pitch the body until the front half and the hind half touch the ground equally (`level`), so paws, elbows, rump and flank rest on the ground in every pose. Gait clips carry `clip.speed`. Clips are cached per shape (mane, gear, ears).

| Clip | Length | Loop | What it does |
|---|---|---|---|
| Idle | 4 s | loop | Looks around, pants, ears twitch, tail sways |
| Walk | 1.2 s | loop | Lateral-sequence walk, about 1 m/s |
| Run | 0.5 s | loop | Rotary gallop with spine flex and a suspension phase, about 5 m/s |
| Sniff | 3 s | loop | Nose to the ground, searching side to side |
| Sit | 3 s | loop | Sitting on the haunches, looking around |
| Lie down | 4 s | loop | Sphinx pose, forelegs forward, hind legs tucked, tail on the ground |
| Howl | 5 s | once | Sits down, throws the head back, long howl with the jaw wide and trembling, stands up again |
| Idle (war mode) | 2.4 s | loop | Low crouch, head down, ears flat, snarling |
| Stalk | 1.6 s | loop | Crouched walk, about 0.5 m/s |
| Growl | 2 s | once | Leans in, jaw open and quivering |
| Bite | 1.1 s | once | Draws back, lunges with the jaw wide, snaps shut and shakes the head |
| Pounce | 1.8 s | once | Crouches, leaps about 1 m forward and 0.55 m up with forelegs reaching and the jaw open, lands, backs off |
| Claw swipe | 1.3 s | once | Rears the forequarters, the right foreleg rakes down and across |
| Hit | 0.7 s | once | Head and shoulders snap back with a yelp, then recovers |
| Death | 2.8 s | once, holds | Recoils, forelegs buckle, rolls onto the right side; legs go limp, jaw slack |

Combat clips, Hit and Death start and end in the war-mode stance. Bite and Hit keep the paws planted while the body shifts (`wgPlant`).

## Checks done

- All clips sampled: nothing below the ground (≤ 3 mm between frames); front and hind halves both on the ground in every levelled clip.
- Viewer in Day, Dusk and Night (eyes glow); option combinations; GLB export with animations (about 3.7 MB).
