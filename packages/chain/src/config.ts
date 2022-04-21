let config = {
  isDev: false,
  debug: false,
}

export function setConfig(value: Partial<typeof config>){
  config = {
    ...config,
    ...value,
  }
}

export function getConfig(){
  return config
}
