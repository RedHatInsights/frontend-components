import { Title, TextInput, FormGroup } from '@patternfly/react-core';
import React from 'react';
import { useState } from 'react';

// basic memoize that only accepts primitive types
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
let counter = 0
const doubleString = (str) => {
  counter += 1
  return `${str}${str}`
}

const memoizedFn = memoize(doubleString)

const FunctionCache = () => {
  const [value, setValue] = useState('')
  const [doubledValue, setDoubledValue] = useState('')
  const handleChange = (value) => {
    setValue(value)
    setDoubledValue(memoizedFn(value))
  }
  return (
    <div>
      <Title headingLevel='h2'>
        Follow the function counter
      </Title>
      <FormGroup label="Type some something same multiple types">
        <TextInput value={value} onChange={handleChange} />
      </FormGroup>
      <p className="pf-v5-u-mt-md">
        Function output
      </p>
      <pre>
        {doubledValue}
      </pre>
      <p p className="pf-v5-u-mt-md">
        Memoized function calls: {counter}
      </p>
    </div>
  )
}

export default FunctionCache;
