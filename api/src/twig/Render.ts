import { injectable } from 'inversify';
import { TwingEnvironment, TwingLoaderFilesystem } from 'twing';

@injectable()
export default class Render {
    private readonly twing = new TwingEnvironment(new TwingLoaderFilesystem(`${__dirname}/views`), {
        cache: false,
    });

    public async fromFile(view: string, vars: { [k: string]: any }): Promise<string> {
        return this.twing.render(view, vars);
    }
}
