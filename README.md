# ShowAndTellAngular


>run sandbox and tinker around :-P
>[Stackblitz](https://stackblitz.com/~/github.com/janpauldahlke/ccwt-example)

> This example is reproduced and simplified and is based on real customer AC's.

#### The Acceptance criteria

Prerequisites 
  * there is a endpoint for fetching the involved pokemons. these can change name, id, and how many!
  * there is another endpoint for fetching the FilterSettings fo a user for pokemons
State of the form:
  * the app loads initially, set checkboxes for the pokemons found in the filter those from the other endpoint
  * when the user toggles the allSelect. we select all or none pokemon and update the checkboxes in the dynamic form
  * when there is at least one, BUT not all pokemon selected by the user, update the allSelect by indeterminate state
  * when none pokemon is selected, remove the check on allSelected
  * when all pokemon is selected, check the allSelected
  * when the user presses save, persist the actual selected pokemon in the PokemonFilter Endpoint (liek post or else)


#### The problem

* timetravel to commit 893fe949 to see the it there
* when dynamically adding controls to pokemon like seen here
* **we can not subscribe to valuechanges via `this.form$.controls.pokemon.valueChanges.subscribe()` because it is tied to the inital formgroup instance. Updating pokemons with setControls swaps with a new instance and thus disconnects from the old subscription.** 
