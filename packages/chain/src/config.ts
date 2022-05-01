let config = {
  isDev: false,
  debug: false,
}

/**
 * ANCHOR def setConfig
 * @param value config value
 */
export function setConfig(value: Partial<typeof config>){
  config = {
    ...config,
    ...value,
  }
}

/**
 * 
 * ANCHOR def getConfig
 */
export function getConfig(){
  return config
}
