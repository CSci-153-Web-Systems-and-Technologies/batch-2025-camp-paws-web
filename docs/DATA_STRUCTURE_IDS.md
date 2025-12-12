animal_type
| id             | name           |
| -------------- | -------------- |
| dog            | Dog            |
| cat            | Cat            |
| unknown-animal | Unknown Animal |

cat_body_condition_scores
| score | label      | description                                                                                                                                                                                       | image_path     |
| ----- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| 1     | Very Thin  | Ribs, spine and hip bones are visible (coat may interfere with visibility). Fat can not be seen or felt under the skin. Obvious loss of muscle mass.                                              | /cat-bcs/1.jpg |
| 3     | Thin       | Ribs, spine and hip bones are easily felt (coat may interfere with visibility). Fat can not be seen or felt under the skin. Obvious loss of muscle mass.                                          | /cat-bcs/3.jpg |
| 5     | Ideal      | Ribs, spine and hip bones are easily felt and may be visible (coat may interfere with visibility). A waist and abdominal tuck are seen when viewed from above and side.                           | /cat-bcs/5.jpg |
| 7     | Overweight | Ribs, spine and hip bones are not visible and difficult to feel. Excess fat is felt around ribs, spine and hip bones. Waist and abdominal tuck are minimal or absent.                             | /cat-bcs/7.jpg |
| 9     | Obesity    | Ribs, spine and hip bones are difficult to feel under a thick layer of fat. Waist and abdomen distended when viewed from above and side. Prominent fat deposits over lower spine, neck and chest. | /cat-bcs/9.jpg |

collar_statuses
| id             | name           |
| -------------- | -------------- |
| collar-with    | With Collar    |
| collar-without | Without Collar |
| collar-unknown | Unknown        |

color_patterns
| id                   | name                     | animal_type_id |
| -------------------- | ------------------------ | -------------- |
| white-puspin         | White Puspin             | cat            |
| black-puspin         | Black Puspin             | cat            |
| tabby-puspin         | Tabby Puspin             | cat            |
| orange-tabby-puspin  | Orange-Tabby Puspin      | cat            |
| bi-color-puspin      | Bi-color Puspin          | cat            |
| calico-puspin        | Calico(Tri-color) Puspin | cat            |
| tortoiseshell-puspin | Tortoiseshell Puspin     | cat            |
| not-sure-cat-pattern | Not Sure                 | cat            |
| bi-color-dog         | Bi-color                 | dog            |
| blenheim             | Blenheim                 | dog            |
| brindle              | Brindle                  | dog            |
| harlequin            | Harlequin                | dog            |
| hound-coat           | Hound Coat               | dog            |
| mantle               | Mantle                   | dog            |
| merle                | Merle                    | dog            |
| patchy               | Patchy                   | dog            |
| plain                | Plain                    | dog            |
| sable                | Sable                    | dog            |
| tri-color-dog        | Tri-color                | dog            |
| tuxedo               | Tuxedo                   | dog            |
| not-sure-dog-pattern | Not Sure                 | dog            |

dog_body_condition_scores
| score | label      | description                                                                                                                                                                                                               | image_path     |
| ----- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| 1     | Very Thin  | Ribs, spine and hip bones are visible (coat may interfere with observation). Fat can not be seen or felt under the skin. Obvious loss of muscle mass. Extreme waist and abdominal tuck.                                   | /dog-bcs/1.png |
| 3     | Thin       | Ribs, spine and hip bones are easy to feel but visible. Fat can not be seen or felt under the skin, especially around the ribs and lower back. Obvious waist and abdominal tuck. Some muscle loss.                        | /dog-bcs/3.png |
| 5     | Ideal      | Ribs, spine and hip bones are easily felt and may be visible (coat may interfere with visibility). A waist and abdominal tuck are seen when viewed from above and side. Fat can be felt around ribs, spine and hip bones. | /dog-bcs/5.png |
| 7     | Overweight | Ribs, spine and hip bones are not visible and difficult to feel. Excess fat is felt around ribs, spine and hip bones. Waist and abdominal tuck are minimal or absent.                                                     | /dog-bcs/7.png |
| 9     | Obesity    | Ribs, spine and hip bones are difficult to feel under a thick layer of fat. Waist and abdomen distended when viewed from above and side. Prominent fat deposits over lower spine, neck and chest.                         | /dog-bcs/9.png |

eye_condition_types
| id            | label                    | description                                                                                  |
| ------------- | ------------------------ | -------------------------------------------------------------------------------------------- |
| eye-none      | None/Normal              | Eyes appear clear, open, and free of excessive discharge.                                    |
| eye-squinting | Squinting/Shut           | The pet is constantly blinking, squinting, or holding one eye tightly shut (indicates pain). |
| eye-discharge | Thick/Colored Discharge  | A noticeable amount of green, yellow, or thick pus coming from one or both eyes.             |
| eye-tearing   | Excessive Tearing/Watery | The eye is constantly running with clear, watery fluid.                                      |
| eye-cloudy    | Cloudy/Hazy Eye          | The front part of the eye (cornea/pupil area) looks hazy, gray, or blue/white.               |
| eye-red       | Red/Inflamed Eyelids     | The eyelids or the white part of the eye are noticeably very red or swollen.                 |

gait_condition_types
| id               | label                          | description                                                                      |
| ---------------- | ------------------------------ | -------------------------------------------------------------------------------- |
| gait-none        | None/Normal                    | Walks and runs without limping or difficulty.                                    |
| gait-mild-limp   | Mild Limping/Favoring a Limb   | Has a slight limp or puts noticeably less weight on one or more legs.            |
| gait-severe-limp | Severe Limping/3-Legged Walk   | Is holding a leg up completely and walking on only three legs.                   |
| gait-wobbly      | Stumbling/Wobbly/Uncoordinated | Walks with a wide stance, stumbles, sways side-to-side, or loses balance easily. |
| gait-dragging    | Dragging/Knuckling             | Is dragging a foot or walking on the top of the paw/knuckles instead of the pad. |
| gait-reluctant   | Reluctance to Move/Stiffness   | Struggles to stand up, moves very slowly, or refuses to jump or run.             |

primary_colors
| id    | label                 | color_class              |
| ----- | --------------------- | ------------------------ |
| black | Black                 | bg-gray-900              |
| white | White                 | bg-white border-gray-300 |
| brown | Brown / Chocolate     | bg-amber-800             |
| tan   | Tan / Fawn            | bg-yellow-600            |
| grey  | Grey / Blue           | bg-gray-500              |
| red   | Red / Orange / Ginger | bg-orange-600            |
| cream | Cream / Yellow        | bg-yellow-200            |
| other | Other / Unsure        | bg-gray-300              |

sexes
| id          | name    |
| ----------- | ------- |
| male        | Male    |
| female      | Female  |
| unknown-sex | Unknown |

skin_condition_types
| id             | label                     | description                                                            |
| -------------- | ------------------------- | ---------------------------------------------------------------------- |
| skin-none      | None/Normal               | No visible skin issues, coat looks healthy.                            |
| skin-hair-loss | Missing Hair/Bald Patches | Noticeable areas where fur is missing.                                 |
| skin-redness   | Redness/Irritation        | Skin looks inflamed, bright red, or heavily scratched.                 |
| skin-wounds    | Wounds/Cuts/Blood         | An open, bloody cut, tear, or severe scrape is visible.                |
| skin-lumps     | Lumps/Bumps/Swelling      | Any significant raised area, lump, or general swelling under the skin. |
| skin-parasites | Heavy Parasites           | Visible fleas, ticks, or excessive black "flea dirt" in the coat.      |