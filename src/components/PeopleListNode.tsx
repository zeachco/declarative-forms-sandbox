import {Button} from '@shopify/polaris';
import React from 'react';

import {
  NodeProps,
  renderNodes,
  SchemaNode,
  useNode,
} from '@zeachco/declarative-forms/lib';

interface Props {
  deletable?: boolean;
}

export function PeopleListNode({node, deletable}: NodeProps & Props) {
  const {errors, addListItem} = useNode(node);

  const additionnalOwnersJsx: React.ReactNodeArray = [];

  node.value.forEach((child: SchemaNode) => {
    // HACK to avoid react key collisions when deleting nodes
    const uid = Math.random();
    additionnalOwnersJsx.push(...renderNodes({child}, `c_${uid}`));
    if (deletable) {
      additionnalOwnersJsx.push(
        <PeopleDeleteButton key={`${uid}_delete`} node={child} />,
      );
    }
  });

  return (
    <div>
      {errors.map((error) => (
        <strong key={error.type}>{node.translate('error', {error})}</strong>
      ))}
      {additionnalOwnersJsx}
      <Button onClick={addListItem}>Add an owner</Button>
    </div>
  );
}

export function PeopleDeleteButton({node}: NodeProps) {
  return (
    <Button destructive onClick={node.deleteSelf}>
      Delete
    </Button>
  );
}
