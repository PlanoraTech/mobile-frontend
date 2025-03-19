import { cleanup, render, waitFor } from '@testing-library/react-native';
import TimetableScreen from '@/app/(tabs)/index';
import { AuthProvider } from '@/contexts/AuthProvider';
import { InstitutionIdProvider } from '@/contexts/InstitutionIdProvider';
import { ThemeProviderLocal } from '@/contexts/ThemeProvider';
import { StandardAuthAdapter } from '@/contexts/StandardAuthAdapter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userEvent } from '@testing-library/react-native';
import { useInstitutionData } from '@/hooks/useInstitutionData';
jest.mock('@/hooks/useInstitutionData', () => ({

    /*mock the useInstitutionData hook
        const [data, setData] = useState<InstitutionData>({

        institution: null,
        timetables: [],
        presentators: [],
        rooms: []
    });

    const [loading, setLoading] = useState<LoadingState>({
        institution: false,
        timetables: false,
        presentators: false,
        rooms: false
    });

    const [error, setError] = useState<string | null>(null);
    */
    useInstitutionData: jest.fn().mockReturnValue({
        data: {
            institution: null,
            timetables: [],
            presentators: [],
            rooms: []
        },
        loading: {
            institution: false,
            timetables: false,
            presentators: false,
            rooms: false
        },
        error: null
    })
}));

jest.mock('@/hooks/useTimetable', () => ({
    useTimetable: jest.fn().mockReturnValue({
        appointments: [],
        events: [],
        loading: false,
        error: null
    })
}));

describe('Index', () => {
    beforeEach(() => {
        AsyncStorage.clear();

    });

    /*
        test('should render the index screen', async () => {
            const indexScreen = render(
                <AuthProvider authAdapter={new StandardAuthAdapter()}>
                    <InstitutionIdProvider>
                        <ThemeProviderLocal>
                            <TimetableScreen />
                        </ThemeProviderLocal>
                    </InstitutionIdProvider>
                </AuthProvider>
            );
    
            expect(indexScreen).toBeTruthy();
            cleanup()
        });
    
    test('should open settings screen', async () => {
        const mockUseInstitutionData = jest.mocked(useInstitutionData);
        mockUseInstitutionData.mockResolvedValue({
            data: {
                institution: null,
                timetables: [],
                presentators: [],
                rooms: []
            },
            loading: {
                institution: false,
                timetables: false,
                presentators: false,
                rooms: false
            },
            error: null
        });
        const mockUseTimetable = jest.mocked(useTimetable);
        mockUseTimetable.mockResolvedValue({
            appointments: [],
            events: [],
            loading: false,
            error: null
        });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 v cvv   oáőpé d                                                  vccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc 

        const indexScreen = render(<AuthProvider authAdapter={new StandardAuthAdapter()}>
            <InstitutionIdProvider>
                <ThemeProviderLocal>
                    <TimetableScreen />
                </ThemeProviderLocal>
            </InstitutionIdProvider>
        </AuthProvider>
        );
        const user = userEvent.setup();

        waitFor(() => {
            const settingsButton = indexScreen.getByTestId('settings-button');
            user.press(settingsButton);
        })
    });
    /*
        test('should switch show events page upon switch', async () => {
            const screen = render(<AuthProvider authAdapter={new StandardAuthAdapter()}>
                <InstitutionIdProvider>
                    <ThemeProviderLocal>
                        <TimetableScreen />
                    </ThemeProviderLocal>
                </InstitutionIdProvider>
            </AuthProvider>
            );
    
            const user = userEvent.setup();
            const switchToggle = screen.getByTestId('switch-toggle')
            await user.press(switchToggle)
        })
    */


})