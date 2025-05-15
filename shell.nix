with import <nixpkgs> {};

stdenv.mkDerivation {
    name = "savart";
    buildInputs = [
        nodejs
				pnpm
    ];
    shellHook = ''
        export PATH="$PWD/node_modules/.bin/:$PATH"
    '';
}

