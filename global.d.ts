// Allow CSS imports (used by NativeWind to inject Tailwind styles via Metro)
declare module '*.css' {
  const content: string;
  export default content;
}
