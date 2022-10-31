import { FormGroup, TextInput } from '@patternfly/react-core';
import React, { useMemo, useState } from 'react';

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

const createHandlers = (fields = [], setState) => fields.reduce((acc, curr) => ({
  ...acc,
  [curr]: {
    onChange: value => {
      setState(prev => ({
        ...prev,
        [curr]: {
          ...prev[curr],
          value
        }
      }))
    },
    // the field has unique validation cache 
    validate: memoize((...args) => validate(...args).then(() => {
      setState(prev => ({
        ...prev,
        [curr]: {
          ...prev[curr],
          isValid: true,
          error: undefined
        }
      }))
    }).catch(error => {
      setState(prev =>({
        ...prev,
        [curr]: {
          ...prev[curr],
          isValid: false,
          error
        }
      }))
    }))
  }
}), {})

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
  
  const {one, two} = useMemo(() => createHandlers(['one', 'two'], setState), [setState])



  return (
    <div>
      <FormGroup helperTextInvalid={state.one.error} validated={state.one.isValid ? "success" : 'error'} label="Field one with async value">
        <TextInput onChange={val => {
          one.onChange(val)
          one.validate(val)
        }} value={state.one.value} />
      </FormGroup>
      <FormGroup helperTextInvalid={state.two.error} validated={state.two.isValid ? "success" : 'error'} label="Field two with async value">
        <TextInput  onChange={val => {
          two.onChange(val)
          two.validate(val)
        }} value={state.two.value} />
      </FormGroup>
      <pre>
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  )
}

export default InvalidReturnValue;
