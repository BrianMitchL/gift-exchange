# gift-exchange

A command-line utility to generate pairs of names for a gift exchange.

Matches will be given to any person in a different family, with the ability to
configure exclusions based on a person's name or family.

## Run

`node index.js config.json`

## Configuration

The configuration has two arrays, `people` and `exclusions`.

In the configuration below, there are two people in the drawing, "Brian" and
"Freja". There are also two exclusions, one of type `name` and one of type
`family`. The two below mean that "Brian" will not be assigned to "Freja" (but
"Freja" could still be assigned to "Brian"), and that anyone in the
"Andersen" family will not be assigned to "Brian".

```json
{
  "people": [
    {
      "name": "Brian",
      "family": "Mitchell"
    },
    {
      "name": "Freja",
      "family": "Andersen"
    }
  ],
  "exclusions": [
    {
      "type": "name",
      "subject": "Brian",
      "value": "Freja"
    },
    {
      "type": "family",
      "subject": "Andersen",
      "value": "Brian"
    }
  ]
}
```

## Notes

There is not real algorithm here, just getting a random unmatched person and
checking if it's valid, otherwise trying a new random person. If the random
matching happens for over 2 seconds, the program will exit due to an infinite
loop. Should this happen, and your configuration isn't impossible, you should
get a match after trying more times.
