export default class URLParser {
    public static parse(url: string):
        | undefined
        | {
              protocol: string;
              hostname: string;
              search: string;
              port: string;
              host: string;
              href: string;
              hash: string;
              pathname: string;
          } {
        const match = url.match(
            /^(https?:)\/\/(([^:/?#]*)(?::([0-9]+))?)([/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/,
        );
        return (
            (match && {
                href: url,
                protocol: match[1],
                host: match[2],
                hostname: match[3],
                port: match[4],
                pathname: match[5],
                search: match[6],
                hash: match[7],
            }) ||
            undefined
        );
    }
}
