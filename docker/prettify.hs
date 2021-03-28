{-# LANGUAGE FlexibleInstances #-}
{-# LANGUAGE UndecidableInstances #-}

import Text.Show.Functions
import Data.List (intercalate)

class Show a => PrettyPrint a where
  pp :: a -> IO ()
  pp = putStrLn . prettify
  prettify :: a -> String

instance Show a => PrettyPrint [a] where
  prettify unaLista
    | esListaLarga unaLista = "[" ++ (intercalate "," . map show . take 10) unaLista ++ ",...]"
    | otherwise             = show unaLista
    where esListaLarga      = not . null . drop 10

instance {-# OVERLAPPABLE #-} Show a => PrettyPrint a where
  prettify = show
