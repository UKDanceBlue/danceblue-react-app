import { Center, Spinner, ZStack } from "native-base";
import { ReactNode, createContext, useContext, useId, useState } from "react";

const LoadingContext = createContext<[Record<string, boolean>, (state: boolean, id: string) => void]>([ {}, () => undefined ]);

/**
 * Provides a loading context for the app, accessed via the useLoading hook. If any loading state is true, a spinner will be displayed.
 * @param params
 * @param params.children The app's content
 * @returns The app's content wrapped in a loading context
 */
export const LoadingWrapper = ({ children }: { children: ReactNode }) => {
  const [ loadingReasons, setLoadingReasons ] = useState<Record<string, boolean>>({});

  const setLoading = (state: boolean, id: string) => {
    setLoadingReasons({ ...loadingReasons, [id]: state });
  };

  return (
    <LoadingContext.Provider value={[ loadingReasons, setLoading ]}>
      <ZStack>
        {children}
        {
          (Object.values(loadingReasons).some((val) => val)) &&
          (
            <Center>
              <Spinner />
            </Center>
          )
        }
      </ZStack>
    </LoadingContext.Provider>
  );
};

/**
 * For local purposes this is identical to useState<boolean>(false), but it also sets the loading state in the global LoadingContext.
 * @returns A two element array. The first element is whether this loading hook is set to true, and the second is a function to change that value.
 */
export const useLoading = (): [boolean, (state: boolean | [boolean, boolean]) => void] => {
  const loadingId = useId();

  const [ loadingReasons, setLoadingReasons ] = useContext(LoadingContext);

  const isLoading = (loadingReasons[loadingId] as boolean | undefined) ?? false;
  const setIsLoading = (state: boolean | [boolean, boolean]) => {
    if (Array.isArray(state)) {
      // This will eventually be used to allow for making the spinner block all input behind it
      // Maybe use an object rather than an array to make it more readable, or a string? dunno
      throw new Error("Not yet implemented");
    } else {
      setLoadingReasons(state, loadingId);
    }
  };

  return [ isLoading, setIsLoading ];
};
