# ShowAndTellAngular


>run sandbox and tinker around :-P
>[Stackblitz](https://stackblitz.com/~/github.com/janpauldahlke/ccwt-example)
>[Slides for presentation](https://slides.com/paulqq/code-fcd644/)

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

> by changing values for e.g
>  * `randomPokemonNumbers = [240, 146, 401, 870, 67, 12, 13, 15]`
>  * and in `getPokemonFilterSettings()` 
>  * both in `src/app/pokemon/filter/services/pokemon.service.ts` one can understand the dynamic nature of this problem


#### The problem

* timetravel to commit 893fe949 to see the it there
* when dynamically adding controls to pokemon like seen here
* **we can not subscribe to valuechanges via `this.form$.controls.pokemon.valueChanges.subscribe()` because it is tied to the inital formgroup instance. Updating pokemons with setControls swaps with a new instance and thus disconnects from the old subscription.** 


#### the implementer solution

* dynamically updates pokemon form controls to keep the UI in sync with the latest data
* refreshes subscriptions on form changes to catch all updates in real time
* uses a combo of distinctUntilChanged and JSON.stringify to filter out duplicate changes
* manually triggers UI updates with cdr.detectChanges() to make sure the view reflects the most recent state, especially after changes that Angular might not pick up automatically
* specifically manages the indeterminate state for the "select all" checkbox, reflecting partial selections correctly

#### thoughts
* often times the formControl, abstractControl nested, does not know about it's inner type. 
* maybe we find a way like https://github.com/ngneat/reactive-forms or make better use of the formstyping. 
* but this leaves us with the need to provide default values initally, but we can not do so, since we create the pokemon dynamically, based on their changing values, see the service and alter pokemon ids here. cringe


#### discussion, can we find better ways

* we know this from reading [telerik dev blog entry](https://www.telerik.com/blogs/testing-dynamic-forms-in-angular)

> As we’ve made changes to the component, we have to manually force the component to detect changes. Thus, the detectChanges method is triggered. This method ensures the template is updated in response to the changes made in the component file.
    

* we ask big brother perplexity about this

>Based on the official Angular documentation and resources, it is indeed true that when dynamically adding or removing form controls in an Angular FormGroup, Angular's change detection system may not automatically detect these structural changes to the form. This situation necessitates manual intervention to ensure the view is updated to reflect the current state of the form.
The Angular guide on dynamic forms provides insights into creating forms dynamically based on data models but does not explicitly cover the change detection aspect in the context of dynamic structural changes
[offical reactive forms dosc](https://angular.io/guide/dynamic-form)

---
> in summary as question. ** we might have found an edge case about change detection that is not very well documented?** 
