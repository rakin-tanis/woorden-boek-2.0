import { Condition, User } from '@/types';
import useRoles from './useRoles';

type ResourceType = Record<string, unknown>;

const useAuth = () => {
  const { roles, loading, error } = useRoles();

  function checkPermission(
    user: User,
    action: string,
    resource: string,
    targetResource?: ResourceType | null
  ): boolean | null { // Return null to indicate loading state
    if (loading) {
      return null; // or return false, depending on your logic
    }

    if (error) {
      console.error("Error loading roles:", error);
      return false; // Handle error case as needed
    }

    // Find roles that match the user's roles
    const userMatchedRoles = roles.filter(role =>
      user.roles.includes(role.name)
    );

    // Check if any role has the required permission
    const hasPermission = userMatchedRoles.some(role => {
      const permission = role.permissions.find(
        (p) => p.action === action && p.resource === resource
      );

      if (!permission) return false;

      // If no conditions, allow the action
      if (!permission.conditions || permission.conditions.length === 0) return true;

      // Check all conditions
      return permission.conditions.every((condition: Condition) =>
        checkCondition(user, targetResource ?? null, condition)
      );
    });

    return hasPermission;
  }

  const checkCondition = (
    user: User,
    targetResource: ResourceType | null,
    condition: Condition
  ): boolean => {
    const { attribute, operator, value } = condition;

    // Special handling for user context
    const contextValue =
      attribute === "userId" ? user._id : targetResource?.[attribute];

    // Null/undefined checks
    if (contextValue === undefined || contextValue === null) {
      return false;
    }

    switch (operator) {
      case "eq":
        return contextValue === value;

      case "neq":
        return contextValue !== value;

      case "gt":
        return typeof contextValue === "number" && typeof value === "number"
          ? contextValue > value
          : false;

      case "gte":
        return typeof contextValue === "number" && typeof value === "number"
          ? contextValue >= value
          : false;

      case "lt":
        return typeof contextValue === "number" && typeof value === "number"
          ? contextValue < value
          : false;

      case "lte":
        return typeof contextValue === "number" && typeof value === "number"
          ? contextValue <= value
          : false;

      case "in":
        return Array.isArray(value) ? value.includes(contextValue) : false;

      case "nin":
        return Array.isArray(value) ? !value.includes(contextValue) : true;

      case "contains":
        if (typeof contextValue === "string" && typeof value === "string") {
          return contextValue.includes(value);
        }
        if (Array.isArray(contextValue)) {
          return contextValue.includes(value);
        }
        return false;

      case "startsWith":
        return typeof contextValue === "string" && typeof value === "string"
          ? contextValue.startsWith(value)
          : false;

      case "endsWith":
        return typeof contextValue === "string" && typeof value === "string"
          ? contextValue.endsWith(value)
          : false;

      case "matches":
        if (typeof contextValue === "string" && value instanceof RegExp) {
          return value.test(contextValue);
        }
        return false;

      default:
        console.warn(`Unsupported operator: ${operator}`);
        return false;
    }
  };

  return { checkPermission };
};

export default useAuth;