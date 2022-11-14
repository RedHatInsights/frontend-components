import { FormGroup, TextInput } from '@patternfly/react-core';
import React, { useState } from 'react';

const memoize = (fn) => {
  if(!fn.cache) {
    fn.cache = {}
  }

  return (...args) => {
    const key = args.join('')
    let result = fn.cache[key]
    if(!result) {
      result = fn(...args)
      fn.cache[key] = result
      
    } 
    return fn.cache[key]
  }
}

// imagine this is a API DB that only allows unique values
const externalState = []

const validate = (value) => new Promise((res, rej) => {
  setTimeout(() => {
    const hasDuplicate = externalState.some(v => v === value);
    if(!hasDuplicate) {
      externalState.push(value)
    }
    return hasDuplicate ? rej(`The value: ${value} is already in the state`) : res();
  }, 500)
})

// wrapped in Promise.resolve to make sure it always returns a promise
const memoizedValidate = Promise.resolve(memoize(validate))

const InvalidReturnValue = () => {
  const [state, setState] = useState({
    one: {
      value: '',
      isValid: true,
      error: undefined
    },
    two: {
      value: '',
      isValid: true,
      error: undefined
    }
  })

  const handleChange = (value, field) => {
    setState(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        value
      }
    }))
    memoizedValidate.then(() => {
      setState(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          isValid: true,
          error: undefined
        }
      }))
    }).catch(error => {
      setState(prev =>({
        ...prev,
        [field]: {
          ...prev[field],
          isValid: false,
          error
        }
      }))
    })
  }



  return (
    <div>
      <FormGroup helperTextInvalid={state.one.error} validated={state.one.isValid ? "success" : 'error'} label="Field one with async value">
        <TextInput onChange={val => handleChange(val ,'one')} value={state.one.value} />
      </FormGroup>
      <FormGroup helperTextInvalid={state.two.error} validated={state.two.isValid ? "success" : 'error'} label="Field two with async value">
        <TextInput onChange={val => handleChange(val ,'two')} value={state.two.value} />
      </FormGroup>
      <pre>
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  )
}

export default InvalidReturnValue;
