function setParamTypeName(path) {
  if (
    path.parentPath.node.id.typeAnnotation &&
    path.parentPath.node.id.typeAnnotation.typeAnnotation.typeParameters &&
    path.parentPath.node.id.typeAnnotation.typeAnnotation.typeParameters.params &&
    path.parentPath.node.id.typeAnnotation.typeAnnotation.typeParameters.params[0].typeName &&
    path.parentPath.node.id.typeAnnotation.typeAnnotation.typeParameters.params[0].typeName.name
  ) {
    return path.parentPath.node.id.typeAnnotation.typeAnnotation.typeParameters.params[0].typeName.name;
  }

  return path.parentPath.node.id.name;
}

/** DO NOT QUESTION THIS MADNESS! */
function getTypePath(path) {
  if (path.parentPath.parentPath.parentPath.parentPath.value && path.parentPath.parentPath.parentPath.parentPath.value.find) {
    return path.parentPath.parentPath.parentPath.parentPath.value;
  }

  if (path.parentPath.parentPath.parentPath.parentPath.parentPath && path.parentPath.parentPath.parentPath.parentPath.parentPath.value) {
    return path.parentPath.parentPath.parentPath.parentPath.parentPath.value;
  }

  return [];
}

function checkForProptypes(path, paramTypeName) {
  const propsDefinition = getTypePath(path).find((propertyPath) => {
    return (
      propertyPath.type &&
      propertyPath.type === 'ExpressionStatement' &&
      propertyPath.expression &&
      propertyPath.expression.left.object.name === paramTypeName &&
      propertyPath.expression.right.type === 'ObjectExpression' &&
      Boolean(propertyPath.expression.right.properties)
    );
  });

  return Boolean(propsDefinition);
}

function reactDocgenFcHandler(_documentation, path) {
  if (path.parentPath.node.init && path.parentPath.node.init.params.length === 0) {
    return;
  }

  if (
    path.node.type === 'ArrowFunctionExpression' &&
    path.parentPath.node.init &&
    path.parentPath.node.init.params &&
    path.parentPath.node.init.params[0] &&
    !path.parentPath.node.init.params[0].typeAnnotation
  ) {
    const paramTypeName = setParamTypeName(path);

    const hasPropTypes = checkForProptypes(path, paramTypeName);

    if (hasPropTypes) {
      return;
    }

    let typePath = getTypePath(path).find((propertyPath) => {
      if (
        propertyPath.type === 'ExportNamedDeclaration' &&
        propertyPath.declaration &&
        propertyPath.declaration.id &&
        propertyPath.declaration.id.name === paramTypeName
      ) {
        return true;
      }

      if (propertyPath.type === 'TSInterfaceDeclaration' && propertyPath.id && propertyPath.id.name === paramTypeName) {
        return true;
      }

      return propertyPath.type === 'TSTypeAliasDeclaration' && propertyPath.id.name === paramTypeName;
    });

    typePath = typePath && typePath.type && typePath.type === 'ExportNamedDeclaration' ? typePath.declaration : typePath;

    if (typePath) {
      const typedParam = Object.assign({}, path.parentPath.node.init.params[0], {
        typeAnnotation: typePath,
      });

      path.parentPath.node.init.params = [typedParam];
    }
  }
}

module.exports = reactDocgenFcHandler;
