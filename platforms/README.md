[![Website](https://img.shields.io/badge/Scale8-Website-9042e7)](https://scale8.com)
[![Documentation](https://img.shields.io/badge/Scale8-Documentation-39cce0)](https://scale8.github.io/docs)
[![API Documentation](https://img.shields.io/badge/Scale8-API%20Documentation-ff0084)](https://scale8.github.io/api-docs)

# Platforms

Create a [custom platform](https://scale8.github.io/docs/creating-platform) to add additional events, data containers or actions. We've made it really easy to get started too. Take a look at the example below.

## Example custom platform action

```typescript
import { PlatformSpec } from '../../../../common/interfaces/PlatformSpec';
import { InputType } from '../../../../common/enums/InputType';
import registerPlatformSpec from '../../../common/RegisterPlatform';

const spec: PlatformSpec = {
    name: 'Hello World', // name of your platform
    version: {
        major: 0,
        minor: 0,
        patch: 1,
    },
    actions: [
        {
            persistence_id: 'hello-world', // a unique id for the action
            name: 'Hello World', // name of your action
            description: 'A simple hello world action example', // a quick description of what the action does
            data: [
                // a set of data inputs for the action. these will be configured in the UI by the user
                {
                    key: 'hello',
                    input_type: InputType.TEXT,
                    description: 'Text to say hello to',
                    default_value: 'World',
                },
            ],
            run: async (
                // the action logic. 'data' is made available to act on user inputs and also other properties
                data,
                log: (msg: string) => void,
                err: (msg: string) => void,
            ): Promise<any> => {
                const message = `Hello ${data.props.hello}`;
                log(message);
                console.log(message);
            },
        },
    ],
};

//finally we register the platform
registerPlatformSpec(spec);
```

## Structure

* ```Platform Name```
    * ```src```
        * ```Main.ts``` //this is the entry point we look for when building.
        * Any other folders / files can be placed here.
    * ```tests```
        * ```*.spec.ts``` files will be automatically picked up and tested.

## Scale8 Core

Our client code runs the same specification, so for more detailed examples of events, data containers and actions, please check out the source.

### The specification

* Platform
    * ```name```: **String** | The name of the platform.
    * ```version```: **Object** | A strict version made of.
        * ```major```: **String** | A bump in major signifies a major new release that is likely not compatible with previous versions.
        * ```minor```: **String** | Minor version increment is ideal for communicating additional small features or other small changes.
        * ```patch```: **String** | A small bug fix or tweak to some underlying event, data container or action. This should not result in a breaking change.
    * ```actions```: **Object Array** | A list of actions provided by the platform.
        * ```persistence_id```: **String** | A unique id that persists through changes to underlying action. Provides the ability to change the name without causing conflicts.
        * ```name```: **String** | Name of the action.
        * ```description```?: **String** | Optional description.
        * ```icon```?: **TypeIcon** | Optional icon.
        * ```data```?: **Object Array** | **See data input below**.
        * ```run```: **Function** | Implements the run function that is triggered on all events, conditions and exceptions being met by the rule.
    * ```events```: **Object Array** | A list of actions provided by the platform.
        * ```persistence_id```: **String** | A unique id that persists through changes to underlying action. Provides the ability to change the name without causing conflicts.
        * ```name```: **String** | Name of the action.
        * ```description```?: **String** | Optional description.
        * ```icon```?: **TypeIcon** | Optional icon.
        * ```data```?: **Object Array** | **See data input below**.
        * ```create```: **Function** | Implements the create function that is triggered when the event is first referenced and used to create required hooks.
        * ```reset```?: **Function** | Optional. Implements the reset function that is triggered if configured by the UI. It will reset the underlying state, so the event will need to occur again to set the state.
        * ```test```: **Function** | Implements the test function that is triggered each time the entire rule is tested.
    * ```data_containers```: **Object Array** | A list of actions provided by the platform.
        * ```persistence_id```: **String** | A unique id that persists through changes to underlying action. Provides the ability to change the name without causing conflicts.
        * ```name```: **String** | Name of the action.
        * ```allow_custom```: **Boolean** | If the data container has a rigid data specification this should be set to true, and the available fields described. Otherwise, this can be set to false and will enable dynamic input, however this needs to be clearly communicated to the end-user via the UI.
        * ```description```?: **String** | Optional description.
        * ```icon```?: **TypeIcon** | Optional icon.
        * ```data```?: **Object Array** | **See data input below**.
        * ```change```?: **Function** | Optional as the data container might be immutable. If however the data is subject to change, then this function can call ```data.trigger()``` to notify the rule to re-check.
        * ```get```: **Function** | Implements the get function. This function is used to retrieve an element from the data container.
        * ```dump```: **Function** | Produces a dump of all the data within the container to make it viewable within the debug layer.


* Data Input
    * ```key```: **String** | The key of the data item.
    * ```input_type```: **InputType** | The input type associated with the data item.
    * ```description```?: **String** | Optional description.
    * ```default_value```?: **DataMapValue** | Optional default value. It will be used in the event this data item has been left empty.
    * ```option_values```?: **DataMapValue Array** | A list of possible values used for inputs like 'Select'.
    * ```child_platform_data_maps```?: **Object Array** | **A repeat of this data input structure**.
    * ```optional```?: **Boolean** | If the data item is optional or not.
    * ```validation_rules```?: **Object Array** | **See validation rules below**.
 
   
* Validation Rules
    * ```type```: **ValidationType** | The type of validation to be applied.
    * ```input_value```: **DataMapValue** | The value for which the data item will be tested against.

### Event example

A simple event that when created will bind to the DOM ready event and set a state upon being triggered.
This state can be accessed at any point to confirm the underlying event occurred.

```typescript
{
    persistence_id: 's8-event-page-ready',
    icon: TypeIcon.PAGE_EVENT,
    name: 'Page Ready',
    description: 'Test will return true when the DOM is ready',
    create: (data) =>
        DOM.isReady(() => {
            data.state.ready = true;
            data.trigger();
        }),
    test: (data) => data.state.ready === true,
},
```

### Data Container example

A Data Container provides the ability to interrogate and test data held inside.
The example below contains a rigid structure (```allow_custom = false```) that specifies fields available to be tested.
If ```allow_custom``` is set to true, then properties can be accessed via [dot notation](https://scale8.github.io/docs/conditions-and-exceptions#accessing-values-with-dot-notation).

```typescript
{
    persistence_id: 'error',
    icon: TypeIcon.BROWSER_DATA_CONTAINER,
    name: 'Last Error',
    description: 'The data of the last error caught in the browser',
    allow_custom: false,
    data: [
        {
            key: 'file',
            input_type: InputType.TEXT,
            description: 'The file name that the error was triggered from',
        },
        {
            key: 'message',
            input_type: InputType.TEXT,
            description: 'The error message',
        },
        {
            key: 'line',
            input_type: InputType.INT_INPUT,
            description: 'The line number at which the error was triggered',
        },
        {
            key: 'column',
            input_type: InputType.INT_INPUT,
            description: 'The column number at which the error was triggered',
        },
    ],
    change: (data) => ErrorData.addUpdateHook(() => data.trigger()),
    get: (data) => ErrorData.get(data.key),
    dump: () => ErrorData.dump(),
},
```

## Build

All platforms are built prior to the API server starting up. This guarantees that builds can be picked up correctly and updated.

To run a platform in development mode use: -

```bash
~> node dev-mode.js --provider=<Provider>
```

Example for running the HelloWorld project: -

```bash
~> node dev-mode.js --provider=HelloWorld
```

It is possible to define the specification and code on-the-fly using an environment variable ```PROXY_FOR``` provided in the edge server.
This will re-wire the edge for that specified platform id using ```PROXY_FOR=<REPLACE WITH_PLATFORM_ID``` and will force the edge server to pick up that specific custom platform via the development server stated as above.

## Tests

While is it currently possible to write unit tests, there is no way to automate testing within a browser. We are working on this currently.
Unit tests should be placed in the ```tests``` directory as shown in the structure above.

## Future

We've already invested a huge amount of time on [custom platforms](https://scale8.github.io/docs/creating-platform), and we've got an exciting roadmap for this feature.
A deeper look at our core platform code or API code will reveal a number of paths to create and build platforms.
We hope to offer developers greater flexibility while addressing speed, optimisation and security concerns associated with plugging in 3rd party solutions.

## Licence

The whole of the Scale8 project is under a AGPL-3.0 licence, however due to the strict network limitation, we have put 'Platforms' (everything contained in this project directory) under a MIT licence instead. The API, Edge, UI and any other projects in the root directory remain under the AGPL-3.0 licence.