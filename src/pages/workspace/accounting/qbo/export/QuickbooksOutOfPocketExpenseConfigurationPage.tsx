import React from 'react';
import HeaderWithBackButton from '@components/HeaderWithBackButton';
import MenuItemWithTopDescription from '@components/MenuItemWithTopDescription';
import OfflineWithFeedback from '@components/OfflineWithFeedback';
import ScreenWrapper from '@components/ScreenWrapper';
import ScrollView from '@components/ScrollView';
import Text from '@components/Text';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';
import Navigation from '@navigation/Navigation';
import withPolicy from '@pages/workspace/withPolicy';
import type {WithPolicyProps} from '@pages/workspace/withPolicy';
import CONST from '@src/CONST';
import ROUTES from '@src/ROUTES';

function QuickbooksOutOfPocketExpenseConfigurationPage({policy}: WithPolicyProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const policyID = policy?.id ?? '';
    const {syncLocations, exportAccount, exportEntity} = policy?.connections?.quickbooksOnline?.config ?? {};
    const isLocationEnabled = Boolean(syncLocations && syncLocations !== CONST.INTEGRATION_ENTITY_MAP_TYPES.NONE);

    return (
        <ScreenWrapper
            includeSafeAreaPaddingBottom={false}
            shouldEnableMaxHeight
            testID={QuickbooksOutOfPocketExpenseConfigurationPage.displayName}
        >
            <HeaderWithBackButton title={translate('workspace.qbo.exportExpenses')} />
            <ScrollView contentContainerStyle={styles.pb2}>
                {!isLocationEnabled && <Text style={[styles.ph5, styles.pb5]}>{translate('workspace.qbo.exportOutOfPocketExpensesDescription')}</Text>}
                <OfflineWithFeedback>
                    <MenuItemWithTopDescription
                        title={exportEntity ? translate(`workspace.qbo.${exportEntity}`) : undefined}
                        description={translate('workspace.qbo.exportAs')}
                        onPress={() => Navigation.navigate(ROUTES.WORKSPACE_ACCOUNTING_QUICKBOOKS_ONLINE_EXPORT_OUT_OF_POCKET_EXPENSES_SELECT.getRoute(policyID))}
                        brickRoadIndicator={undefined}
                        shouldShowRightIcon
                    />
                </OfflineWithFeedback>
                {exportEntity === CONST.QUICKBOOKS_EXPORT_ENTITY.VENDOR_BILL && !isLocationEnabled && (
                    <Text style={[styles.ph5, styles.mutedTextLabel, styles.pt2, styles.pb2]}>{translate('workspace.qbo.exportVendorBillDescription')}</Text>
                )}
                {isLocationEnabled && <Text style={[styles.ph5, styles.mutedTextLabel, styles.pt2]}>{translate('workspace.qbo.outOfPocketLocationEnabledDescription')}</Text>}
                {!isLocationEnabled && (
                    <OfflineWithFeedback>
                        <MenuItemWithTopDescription
                            title={exportAccount}
                            onPress={() => Navigation.navigate(ROUTES.WORKSPACE_ACCOUNTING_QUICKBOOKS_ONLINE_EXPORT_OUT_OF_POCKET_EXPENSES_ACCOUNT_SELECT.getRoute(policyID))}
                            brickRoadIndicator={undefined}
                            shouldShowRightIcon
                        />
                    </OfflineWithFeedback>
                )}
            </ScrollView>
        </ScreenWrapper>
    );
}

QuickbooksOutOfPocketExpenseConfigurationPage.displayName = 'QuickbooksExportOutOfPocketExpensesPage';

export default withPolicy(QuickbooksOutOfPocketExpenseConfigurationPage);
