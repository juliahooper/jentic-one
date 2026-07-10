/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ToolkitDiscoveryItemResponse } from './ToolkitDiscoveryItemResponse';
/**
 * Discovery response showing toolkits that serve a given API identity.
 */
export type ToolkitDiscoveryResponse = {
    available_toolkits: Array<ToolkitDiscoveryItemResponse>;
    hint?: string;
    name: string;
    vendor: string;
    version: string;
};

