import {
  decorateWithPolarisComponents,
  PolarisLayoutGridPosition,
  PolarisPolymorphicNode,
  PolarisRangeSlider,
} from '@zeachco/declarative-forms/lib/plugins/polaris';
import {DeclarativeFormContext} from '@zeachco/declarative-forms';
import {Card} from '@shopify/polaris';
import {PeopleDeleteButton, PeopleListNode} from '../components/PeopleListNode';
import {FormCardContainer} from '../components/FormCardContainer';
import {SpecialBusinessDetails} from '../components/SpecialBusinessDetails';

export function decorateForm(context: DeclarativeFormContext) {
  decorateWithPolarisComponents(context);
  context
    .where(({path}) => path.toStringShort() === 'legalEntity.businessDetails')
    .replaceWith(SpecialBusinessDetails);
  context
    .where(({isVariant, depth}) => isVariant && depth === 1)
    .prependWith(Card, {title: 'Dynamic form', sectioned: true})
    .replaceWith(PolarisPolymorphicNode, {nestWithChild: 'businessDetails'});
  context
    .where(({isVariant, depth}) => isVariant && depth !== 1)
    .replaceWith(PolarisPolymorphicNode);
  context
    .where(({type, isList}) => type === 'AdditionalOwner' && isList)
    .replaceWith(PeopleListNode);
  context
    .where(({type, isList}) => type === 'AdditionalOwner' && !isList)
    .replaceWith(PolarisLayoutGridPosition, {grid: [['firstName', 'lastName']]})
    .packWith(FormCardContainer)
    .appendWith(PeopleDeleteButton);
  context
    .where(({depth, name}) => depth === 3 && name !== 'businessDetails')
    .wrapWith(FormCardContainer);
  context
    .where(({name}) => name === 'ownershipPercentage')
    .replaceWith(PolarisRangeSlider, {min: 0, max: 100, output: true});
}
