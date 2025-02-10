import { SetMetadata } from '@nestjs/common';

const EMPTY_STRING = '';
const IS_PUBLIC_KEY = 'isPublic';
const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export { EMPTY_STRING, IS_PUBLIC_KEY, Public };
