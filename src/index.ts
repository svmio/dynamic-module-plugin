import path = require('path')
import {Compiler} from "webpack";
import {fs} from 'memfs'
import {isRelativePath} from './util';

// for webpack 4
interface Storage{
  data: Map<string, any> | Record<string, any>
}

// for webpack 5
interface Backend{
  _data: Map<string, any>
  _levels: any[]
  _currentLevel: number
}

interface DynamicFs{
  _statStorage: Storage
  _readFileStorage: Storage
  _statBackend: Backend
  _readFileBackend: Backend
}

const NS = 'DynamicModulePlugin'

const store = new Set<string>()

class DynamicModulePlugin {

  fileSystem: DynamicFs

  apply(compiler: Compiler){
    this.fileSystem = compiler.inputFileSystem as any as DynamicFs;
    const self = this
    compiler.hooks.normalModuleFactory.tap(NS, function(factory){
      factory.hooks.beforeResolve.tap(NS, function(result){
        const id = resolveModuleId(result.request, result.context)
        if(store.has(id)){
          self.registerModule(id)
        }
      })
    })
  }

  registerStats(id: string){
    const {_statStorage, _statBackend} = this.fileSystem
    const stats = fs.statSync(id)
    if(_statBackend){
      const level = _statBackend._levels[_statBackend._currentLevel];
      (_statBackend._data as Map<string, any>).set(id, {err: null, level, result: stats});
    }else if(_statStorage){
      if(_statStorage.data instanceof Map){
        (_statStorage.data as Map<string, any>).set(id, [null, stats]);
      }else {
        (_statStorage.data as Record<string, any>)[id] = [null, stats];
      }
    }
  }

  registerFileBuffer(id: string){
    const content = fs.readFileSync(id)
    const buffer = Buffer.from(content)
    const {_readFileStorage, _readFileBackend} = this.fileSystem
    if(_readFileBackend){
      const level = _readFileBackend._levels[_readFileBackend._currentLevel];
      (_readFileBackend._data as Map<string, any>).set(id, {err: null, level, result: buffer});
    }else if(_readFileStorage){
      if(_readFileStorage.data instanceof Map){
        (_readFileStorage.data as Map<string, any>).set(id, [null, buffer]);
      }else {
        (_readFileStorage.data as Record<string, any>)[id] = [null, buffer];
      }
    }
  }

  registerModule(id: string){
    id = resolveModuleId(id)
    if(!store.has(id)) {
      return;
    }
    this.registerStats(id)
    this.registerFileBuffer(id)
  }
}

export function resolveModuleId(id: string, context?: string){
  context = context || process.cwd()
  if(isRelativePath(id)){
    id = path.resolve(context, id)
  }
  return id
}

function defineDynamic(id: string, content: string, context?: string){
  try {
    id = resolveModuleId(id, context)
    const baseDir = path.dirname(id)
    if(!fs.existsSync(baseDir)) {
      fs.mkdirpSync(baseDir)
    }
    fs.writeFileSync(id, content)
    store.add(id)
  }catch (e){
    throw new Error(e.message)
  }
}

function purgeDynamic(id: string, context?: string){
  id = resolveModuleId(id, context)
  if(store.has(id)){
    if(fs.existsSync(id)){
      fs.unlinkSync(id)
    }
    store.delete(id)
  }
}

export {DynamicModulePlugin, defineDynamic, purgeDynamic}
