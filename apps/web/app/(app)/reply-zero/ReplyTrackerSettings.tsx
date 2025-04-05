"use client";

import { useCallback } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/Input";
import { toastSuccess, toastError } from "@/components/Toast";
import { isErrorMessage } from "@/utils/error";
import { useRule } from "@/hooks/useRule";
import type { RuleResponse } from "@/app/api/user/rules/[id]/route";
import { LoadingContent } from "@/components/LoadingContent";
import {
  updateRuleSettingsBody,
  type UpdateRuleSettingsBody,
} from "@/utils/actions/rule.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateRuleSettingsAction } from "@/utils/actions/rule";

export const ReplyTrackerSettings = ({ ruleId }: { ruleId?: string }) => {
  const { data, isLoading, error } = useRule(ruleId);

  return (
    <LoadingContent loading={isLoading} error={error}>
      {data?.rule && <ReplyTrackerSettingsForm rule={data.rule} />}
    </LoadingContent>
  );
};

const ReplyTrackerSettingsForm = ({ rule }: { rule: RuleResponse["rule"] }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateRuleSettingsBody>({
    resolver: zodResolver(updateRuleSettingsBody),
    defaultValues: {
      id: rule?.id,
      instructions: rule?.instructions ?? "",
    },
  });

  const onSubmit: SubmitHandler<UpdateRuleSettingsBody> = useCallback(
    async (data) => {
      const res = await updateRuleSettingsAction(data);
      if (isErrorMessage(res))
        toastError({ description: "There was an error updating the settings" });
      else toastSuccess({ description: "Settings updated" });
    },
    [],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        type="text"
        as="textarea"
        rows={5}
        autosizeTextarea
        name="instructions"
        label="When to reply"
        registerProps={register("instructions", { required: true })}
        error={errors.instructions}
      />

      <Button type="submit" loading={isSubmitting}>
        Save
      </Button>
    </form>
  );
};
