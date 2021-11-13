import { Container } from 'inversify';
import { CT } from '../mongo/types/Types';
import Model from '../mongo/abstractions/Model';
import Repo from '../mongo/abstractions/Repo';
import Manager from '../abstractions/Manager';

// Used to create a new instance of some Repo type
export type RCT<U extends Repo<Model>> = new (...args: any[]) => U;
// Used to create a new instance of some Manager type
type MCT<U extends Manager<Model>> = new (...args: any[]) => U;

export interface ChainedDependency {
    model: CT<Model>;
    repository: {
        id: symbol;
        constructor: RCT<Repo<Model>>;
    };
    manager: {
        id: symbol;
        constructor: MCT<Manager<Model>>;
    } | null;
}

interface ChainedDependencyWithManager extends ChainedDependency {
    manager: {
        id: symbol;
        constructor: MCT<Manager<Model>>;
    };
}

// The utility functions in this class will modify the container parameter
export class ChainDependenciesBinder {
    public static bindRepos(container: Container, chainedDependencies: ChainedDependency[]): void {
        chainedDependencies.forEach((chainedDependency: ChainedDependency) => {
            container
                .bind(chainedDependency.repository.id)
                .to(chainedDependency.repository.constructor)
                .inSingletonScope();
        });
    }

    public static dependenciesWithManagers(
        chainedDependencies: ChainedDependency[],
    ): ChainedDependencyWithManager[] {
        return chainedDependencies.filter(
            (chainedDependency: ChainedDependency) => chainedDependency.manager !== null,
        ) as ChainedDependencyWithManager[];
    }

    public static bindManagers(
        container: Container,
        chainedDependencies: ChainedDependency[],
    ): void {
        ChainDependenciesBinder.dependenciesWithManagers(chainedDependencies).forEach(
            (chainedDependency: ChainedDependencyWithManager) => {
                container
                    .bind(chainedDependency.manager.id)
                    .to(chainedDependency.manager.constructor)
                    .inSingletonScope();
            },
        );
    }

    public static bindAllReposFactory(
        factoryId: symbol,
        container: Container,
        chainedDependencies: ChainedDependency[],
    ): void {
        const repos = chainedDependencies.map(
            (chainedDependency: ChainedDependency) => chainedDependency.repository.id,
        );

        container.bind(factoryId).toFactory((context) => () => {
            return repos.map((repoType: symbol) => context.container.get(repoType));
        });
    }

    public static bindGQLManagersFactory(
        factoryId: symbol,
        container: Container,
        chainedDependencies: ChainedDependency[],
    ): void {
        const GQLManagers = ChainDependenciesBinder.dependenciesWithManagers(
            chainedDependencies,
        ).map((chainedDependency: ChainedDependencyWithManager) => chainedDependency.manager.id);

        container.bind(factoryId).toFactory((context) => () => {
            return GQLManagers.map((managerType: symbol) => context.container.get(managerType));
        });
    }

    public static bindRepoFromModelFactory(
        factoryId: symbol,
        container: Container,
        chainedDependencies: ChainedDependency[],
    ): void {
        const repoMap: Map<string, symbol> = new Map(
            chainedDependencies.map((chainedDependency: ChainedDependency) => {
                return [chainedDependency.model.name, chainedDependency.repository.id];
            }),
        );

        container.bind(factoryId).toFactory((context) => (model: string | CT<Model>) => {
            const modelName = typeof model === 'string' ? model : model.name;
            const repoType = repoMap.get(modelName);
            if (!repoType) {
                throw new Error(`Unmapped model ${modelName}`);
            }
            return context.container.get(repoType);
        });
    }

    public static bindRepoFromManagerFactory(
        factoryId: symbol,
        container: Container,
        chainedDependencies: ChainedDependency[],
    ): void {
        const repoMap: Map<string, symbol> = new Map(
            ChainDependenciesBinder.dependenciesWithManagers(chainedDependencies).map(
                (chainedDependency: ChainedDependencyWithManager) => {
                    return [
                        chainedDependency.manager.constructor.name,
                        chainedDependency.repository.id,
                    ];
                },
            ),
        );

        container.bind(factoryId).toFactory((context) => (managerName: string) => {
            const repoType = repoMap.get(managerName);
            if (!repoType) {
                throw new Error(`Unmapped manager ${managerName}`);
            }
            return context.container.get(repoType);
        });
    }

    public static bindModelFromRepoFactory(
        factoryId: symbol,
        container: Container,
        chainedDependencies: ChainedDependency[],
    ): void {
        const modelMap: Map<string, CT<Model>> = new Map(
            chainedDependencies.map((chainedDependency: ChainedDependency) => {
                return [chainedDependency.repository.constructor.name, chainedDependency.model];
            }),
        );

        container.bind(factoryId).toFactory(() => (repoName: string) => {
            const repoType = modelMap.get(repoName);
            if (!repoType) {
                throw new Error(`Unmapped repo ${repoName}`);
            }

            return modelMap.get(repoName);
        });
    }

    public static bindRepoFromRepoNameFactory(
        factoryId: symbol,
        container: Container,
        chainedDependencies: ChainedDependency[],
    ): void {
        const repoMap: Map<string, symbol> = new Map(
            chainedDependencies.map((chainedDependency: ChainedDependency) => {
                return [
                    chainedDependency.repository.constructor.name,
                    chainedDependency.repository.id,
                ];
            }),
        );

        container.bind(factoryId).toFactory((context) => (repoName: string) => {
            const repoType = repoMap.get(repoName);
            if (!repoType) {
                throw new Error(`Unmapped repo ${repoName}`);
            }

            return context.container.get(repoType);
        });
    }
}
